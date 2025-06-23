use axum::{
    extract::Extension,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use tokio::sync::Mutex;
use std::sync::Arc;
use utoipa::OpenApi;

use crate::models::{RegisterRequest, Role, User};
use crate::middleware::auth::Claims;

#[derive(OpenApi)]
#[openapi(
    paths(admin_route),
    components(schemas(User))
)]
pub struct ProtectedApi;

#[utoipa::path(
    get,
    path = "/admin",
    responses(
        (status = 200, description = "Admin access granted", body = User),
        (status = 403, description = "Forbidden")
    ),
    security(("api_key" = []))
)]
pub async fn admin_route(Extension(user): Extension<Arc<User>>) -> impl IntoResponse {
    if user.role == Role::Admin {
        (StatusCode::OK, Json(user)).into_response()
    } else {
        (
            StatusCode::FORBIDDEN,
            Json(json!({"error": "Admin access required"})),
        ).into_response()
    }
}

#[utoipa::path(
    get,
    path = "/admin/dashboard",
    responses(
        (status = 200, description = "Admin dashboard info", body = String),
        (status = 403, description = "Forbidden")
    ),
    security(("api_key" = []))
)]
pub async fn admin_dashboard(
    Extension(claims): Extension<Arc<Claims>>,
    Extension(users): Extension<Arc<std::sync::Mutex<Vec<User>>>>
) -> impl IntoResponse {
    if claims.role == Role::Admin {
        let users = users.lock().unwrap();
        let user_list: Vec<_> = users.iter().map(|u| {
            serde_json::json!({
                "id": u.id,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "role": format!("{:?}", u.role)
            })
        }).collect();
        let system_info = serde_json::json!({
            "user_count": users.len(),
            "users": user_list
        });
        (StatusCode::OK, Json(system_info)).into_response()
    } else {
        (
            StatusCode::FORBIDDEN,
            Json(json!({"error": "Admin access required"})),
        ).into_response()
    }
}

#[utoipa::path(
    post,
    path = "/admin/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "Admin registered successfully", body = User),
        (status = 403, description = "Forbidden")
    ),
    security(("api_key" = []))
)]
pub async fn register_admin(
    Extension(claims): Extension<Arc<Claims>>,
    Extension(users): Extension<Arc<Mutex<Vec<User>>>>,
    Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
    if claims.role != Role::Admin {
        return (
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Admin access required" })),
        )
            .into_response();
    }

    let mut users = users.lock().await;

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
        first_name: "Admin".to_string(), 
        last_name: "Account".to_string(),
        password: hashed,
        role: Role::Admin,
    };

    users.push(new_user.clone());

    (StatusCode::CREATED, Json(new_user)).into_response()
}


#[utoipa::path(
    get,
    path = "/user/profile",
    responses(
        (status = 200, description = "User profile info", body = String),
        (status = 403, description = "Forbidden")
    ),
    security(("api_key" = []))
)]
pub async fn user_profile(
    Extension(claims): Extension<Arc<Claims>>,
    Extension(users): Extension<Arc<std::sync::Mutex<Vec<User>>>>
) -> impl IntoResponse {
    if claims.role == Role::User {
        let users = users.lock().unwrap();
        if let Some(user) = users.iter().find(|u| u.email == claims.sub) {
            let user_info = serde_json::json!({
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": format!("{:?}", user.role)
            });
            (StatusCode::OK, Json(user_info)).into_response()
        } else {
            (StatusCode::NOT_FOUND, Json(json!({"error": "User not found"}))).into_response()
        }
    } else {
        (
            StatusCode::FORBIDDEN,
            Json(json!({"error": "User access required"})),
        ).into_response()
    }
}
