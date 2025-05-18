mod routes;

use napi::bindgen_prelude::*;
use napi_derive::napi;
pub use routes::*;

#[napi]
pub fn shout (input: String) -> String {
    format!("{}", input)
}
