//! Responsible for parsing and validating JWT tokens.

use actix_web::http::StatusCode;
use jsonwebtoken::{decode, decode_header, DecodingKey, Validation};
use serde::Deserialize;
use uuid::Uuid;

use crate::error::ServiceError;

use super::jwks::Jwks;

/// Fields the token has (only the necessary fields are actually extracted).
#[derive(Debug, Clone, Deserialize)]
pub struct Claims {
    /// The subject
    pub sub: Uuid,
    /// The OAuth2 scope
    pub scope: String,
}

impl Claims {
    /// Validate the provided token and parses it.
    ///
    /// # Errors
    /// * If the token is invalid.
    pub fn validate(token: &str) -> Result<Self, ServiceError> {
        eprintln!("token {token}");
        let header = decode_header(token)
            .map_err(|_| ServiceError::new(StatusCode::UNAUTHORIZED, "invalid token".to_owned()))?;
        let kid = header.kid.as_ref().ok_or_else(|| {
            ServiceError::new(StatusCode::UNAUTHORIZED, "missing kid in token".to_owned())
        })?;

        let jwk = Jwks::get().find(kid).ok_or_else(|| {
            ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "no valid key found".to_owned(),
            )
        })?;
        eprintln!("jwk {jwk:?}");

        let decoding_key = &DecodingKey::from_jwk(jwk)
            .map_err(|err| ServiceError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

        eprintln!("Got key");
        let claims = decode(token, decoding_key, &Validation::new(header.alg))
            .map_err(|_| ServiceError::new(StatusCode::UNAUTHORIZED, "invalid token".to_owned()))?
            .claims;
        eprintln!("Decoded");
        Ok(claims)
    }
}
