//! All DTOs associated with [`PlantingDto`].

use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};
use uuid::Uuid;

/// Represents plant planted on a map.
/// E.g. a user drags a plant from the search results and drops it on the map.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
pub struct PlantingDto {
    /// The id of the planting.
    pub id: Uuid,
    /// The plant layer the plantings is on.
    #[serde(rename = "layerId")]
    pub layer_id: i32,
    /// The plant that is planted.
    #[serde(rename = "plantId")]
    pub plant_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The width of the plant on the map.
    pub width: i32,
    /// The height of the plant on the map.
    pub height: i32,
    /// The rotation in degrees (0-360) of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: f32,
}

/// Used to create a new planting.
#[typeshare]
#[derive(Debug, Clone, Default, Serialize, Deserialize, ToSchema)]
pub struct NewPlantingDto {
    /// The id of the planting.
    pub id: Option<Uuid>,
    /// The plant layer the plantings is on.
    #[serde(rename = "layerId")]
    pub layer_id: i32,
    /// The plant that is planted.
    #[serde(rename = "plantId")]
    pub plant_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The width of the plant on the map.
    pub width: i32,
    /// The height of the plant on the map.
    pub height: i32,
    /// The rotation of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: f32,
}

/// Used to differentiate between different update operations on plantings.
///
/// Ordering of enum variants is important.
/// Serde will try to deserialize starting from the top.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(tag = "type", content = "content")]
pub enum UpdatePlantingDto {
    /// Transform a plantings.
    Transform(TransformPlantingDto),
    /// Move a plantings an the map.
    Move(MovePlantingDto),
}

/// Used to transform an existing planting.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
pub struct TransformPlantingDto {
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The rotation of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: f32,
}

/// Used to move an existing planting.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
pub struct MovePlantingDto {
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
}

/// Query parameters for searching plantings.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantingSearchParameters {
    /// The id of the plant the planting references.
    pub plant_id: Option<i32>,
    /// The id of the plants layer the planting is placed on.
    pub layer_id: Option<i32>,
}