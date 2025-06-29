use std::collections::HashMap;
use napi::bindgen_prelude::*;
use napi_derive::napi;

#[derive(Debug)]
struct Node {
    children: HashMap<String, Node>,
    eor: bool,
}

impl Node {
    fn new () -> Self {
        Node {
            children: HashMap::new(),
            eor: false,
        }
    }
}

#[napi]
pub struct RouteStore {
    root: Node,
}

#[napi]
impl RouteStore {
    #[napi(constructor)]
    pub fn new () -> Self {
        RouteStore {
            root: Node::new(),
        }
    }

    #[napi]
    pub fn insert (&mut self, path: String) {
        let parts = path
            .split('/')
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>();

        let mut node = &mut self.root;

        for part in parts {
            node = node.children.entry(part.to_string()).or_insert(Node::new());
        }

        node.eor = true;
    }

    fn search_recursive<'a>(
        node: &'a Node,
        parts: &[&str],
        idx: usize,
        params: &mut HashMap<String, String>,
        matched_path: &mut Vec<String>,
    ) -> Option<RouteMatch> {
        if idx == parts.len() {
            if node.eor {
                return Some(RouteMatch {
                    pattern: format!("/{}", matched_path.join("/")),
                    params: params.clone(),
                });
            } else {
                return None;
            }
        }

        let part = parts[idx];

        // Static match
        if let Some(child) = node.children.get(part) {
            matched_path.push(part.to_string());
            if let Some(result) = Self::search_recursive(child, parts, idx + 1, params, matched_path) {
                return Some(result);
            }
            matched_path.pop();
        }

        // Dynamic match
        for (key, child) in node.children.iter().filter(|(k, _)| k.starts_with(":")) {
            let param_name = &key[1..];
            matched_path.push(key.clone());
            params.insert(param_name.to_string(), part.to_string());

            if let Some(result) = Self::search_recursive(child, parts, idx + 1, params, matched_path) {
                return Some(result);
            }

            matched_path.pop();
            params.remove(param_name);
        }

        // Wildcard match
        if let Some(child) = node.children.get("*") {
            matched_path.push("*".to_string());
            return Some(RouteMatch {
                pattern: format!("/{}", matched_path.join("/")),
                params: params.clone(),
            });
        }

        None
    }

    #[napi]
    pub fn search(&self, path: String) -> Option<RouteMatch> {
        let parts: Vec<&str> = path
            .split('/')
            .filter(|s| !s.is_empty())
            .collect();

        let mut params = HashMap::new();
        let mut matched_path = Vec::new();

        Self::search_recursive(&self.root, &parts, 0, &mut params, &mut matched_path)
    }

    // #[napi]
    // pub fn search (&self, path: String) -> Option<RouteMatch> {
    //     let parts = path
    //         .split('/')
    //         .filter(|s| !s.is_empty())
    //         .collect::<Vec<_>>();
    //
    //     let mut params = HashMap::new();
    //     let mut node = &self.root;
    //     let mut matched_path = Vec::new();
    //
    //     for part in parts {
    //         // Try static match
    //         if let Some(child) = node.children.get(part) {
    //             matched_path.push(part.to_string());
    //             node = child;
    //             continue;
    //         }
    //
    //         // Try dynamic match
    //         if let Some((key, child)) = node.children.iter().find(|(k, _)| k.starts_with(":")) {
    //             matched_path.push(key.clone());
    //             params.insert(key[1..].to_string(), part.to_string());
    //             node = child;
    //             continue;
    //         }
    //
    //         // Try wildcard match
    //         if let Some(child) = node.children.get("*") {
    //             matched_path.push("*".to_string());
    //             node = child;
    //             break;
    //         }
    //
    //         return None;
    //     }
    //
    //     if node.eor {
    //         Some(RouteMatch {
    //             pattern: format!("/{}", matched_path.join("/")),
    //             params,
    //         })
    //     } else {
    //         None
    //     }
    // }
}

#[napi(object)]
#[derive(Debug)]
pub struct RouteMatch {
    pub pattern: String,
    pub params: HashMap<String, String>,
}
