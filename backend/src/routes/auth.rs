use axum::extract::State;
use axum::{http::StatusCode, response::IntoResponse, Json};
use bcrypt::hash_with_salt;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use utoipa::OpenApi;

use crate::middleware::auth::Claims;
use crate::models::{LoginRequest, LoginResponse, RegisterRequest, Role, User};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(paths(login), components(schemas(LoginRequest, LoginResponse)))]
pub struct AuthApi;

#[utoipa::path(
    post,
    path = "/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = LoginResponse),
        (status = 401, description = "Invalid credentials")
    )
)]
pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    let users = state.users.lock().unwrap();

    // Check if the user exists and the password matches
    let user = users.iter().find(|u| u.email == payload.email);
    if user.is_none()
        || bcrypt::verify(payload.password.as_bytes(), &user.unwrap().password).ok() != Some(true)
    {
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        )
            .into_response();
    }

    let claims = Claims {
        sub: payload.email.clone(),
        role: user.unwrap().role.clone(),
        exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
    };
    let config = state.config.clone();
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_ref()),
    )
    .unwrap();

    // Simulate refresh token (not implemented)
    let refresh_token = "dummy_refresh_token";

    // Return user info (excluding password)
    let user_info = json!({
        "id": user.unwrap().id,
        "email": user.unwrap().email,
        "first_name": user.unwrap().first_name,
        "last_name": user.unwrap().last_name,
        "role": format!("{:?}", user.unwrap().role)
    });

    return (
        StatusCode::OK,
        Json(json!({
            "access_token": token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user_info
        }))
    ).into_response();
}

#[utoipa::path(
    post,
    path = "/admin/register",
    request_body = LoginRequest, // or a dedicated RegisterRequest
    responses(
        (status = 201, description = "Admin registered successfully", body = User),
        (status = 403, description = "Forbidden")
    ),
    security(("api_key" = []))
)]
pub async fn register_admin(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>, // consider creating a proper RegisterRequest
) -> impl IntoResponse {
    let mut users = state.users.lock().unwrap();
    let user = users.iter().find(|u| u.email == payload.email);
    if user.is_none() || user.unwrap().role != Role::Admin {
        return (
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Admin access required" })),
        )
            .into_response();
    }

    if users.iter().any(|u| u.email == payload.email) {
        return (
            StatusCode::CONFLICT,
            Json(json!({ "error": "Email already registered" })),
        )
            .into_response();
    }

    let hashed = bcrypt::hash(&payload.password, bcrypt::DEFAULT_COST).unwrap();
    let new_user = User {
        id: users.len() as i32 + 1,
        email: payload.email.clone(),
        first_name: "Admin".to_string(), // you'd want to pass these
        last_name: "Account".to_string(),
        password: hashed,
        role: Role::Admin,
    };

    users.push(new_user.clone());

    (StatusCode::CREATED, Json(new_user)).into_response()
}


#[utoipa::path(
    post,
    path = "/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "User registered successfully"),
        (status = 400, description = "Bad request")
    )
)]
pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<crate::models::RegisterRequest>,
) -> impl IntoResponse {
    // In production, save to a database
    if payload.email.is_empty()
        || payload.password.is_empty()
        || payload.first_name.is_empty()
        || payload.last_name.is_empty()
    {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "First name, last name, email, and password are required"})),
        )
            .into_response();
    }

    let config = state.config.clone();
    // Here you would typically hash the password and save the user to a database
    let hashed_password = hash_with_salt(
        payload.password.as_bytes(),
        bcrypt::DEFAULT_COST,
        config.jwt_salt,
    )
    .unwrap();

    let mut users = state.users.lock().unwrap();

    let new_user = crate::models::User {
        id: users.len() as i32 + 1, // Simple ID generation
        email: payload.email.clone(),
        first_name: payload.first_name.clone(),
        last_name: payload.last_name.clone(),
        password: hashed_password.to_string(),
        role: Role::User,
    };

    users.push(new_user.clone());

    // Generate JWT token for the new user
    let claims = Claims {
        sub: new_user.email.clone(),
        role: new_user.role.clone(),
        exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
    };
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_ref()),
    )
    .unwrap();

    // Simulate refresh token (not implemented)
    let refresh_token = "dummy_refresh_token";

    // Return user info (excluding password)
    let user_info = json!({
        "id": new_user.id,
        "email": new_user.email,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "role": format!("{:?}", new_user.role)
    });

    (
        StatusCode::CREATED,
        Json(json!({
            "access_token": token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user_info
        })),
    )
        .into_response()
}
