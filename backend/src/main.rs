use std::sync::{Arc, Mutex};

use axum::{
    http::{header, Method},
    routing::{get, post},
    Extension, Router,
};
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

pub mod middleware;
pub mod models;
pub mod routes;
pub mod utils;

use crate::{
    middleware::auth::auth_middleware,
    models::{Role, User},
    routes::{auth, protected},
    utils::load_env,
};
use bcrypt;

#[derive(Debug, Clone)]
pub struct AppState {
    pub config: Arc<utils::Config>,
    pub users: Arc<Mutex<Vec<User>>>,
}

#[tokio::main]
async fn main() {
    #[derive(OpenApi)]
    #[openapi(
        info(title = "Auth API", description = "A simple auth API"),
        paths(auth::login, auth::register, protected::admin_dashboard, protected::register_admin, protected::user_profile),
        tags(
            (name = "auth", description = "Authentication routes"),
            (name = "admin", description = "Admin routes"),
            (name = "user", description = "User routes")
        ),
        components(schemas(
            models::User,
            models::Role,
            models::LoginRequest,
            models::LoginResponse,
            models::RegisterRequest
        ))
    )]
    struct ApiDoc;

    let state = AppState {
        config: Arc::new(load_env()),
        users: Arc::new(Mutex::new(vec![User {
            id: 1,
            email: "admin@example.com".to_string(),
            first_name: "Admin".to_string(),
            last_name: "User".to_string(),
            password: bcrypt::hash("adminpassword", bcrypt::DEFAULT_COST).unwrap(),
            role: Role::Admin,
        }])),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/admin/dashboard", get(protected::admin_dashboard))
        .route("/user/profile", get(protected::user_profile))
        .route("/admin/register", post(protected::register_admin))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
        .layer(Extension(state.users.clone()))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/login", post(auth::login))
        .route("/register", post(auth::register))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
