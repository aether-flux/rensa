import { require } from "../utils/require.js";
const { shout } = require("../../rust/index.node");
class Node {
    constructor() {
        this.children = {}; // Store characters
        this.eor = false; // Check if path or route ends (eor = end of route)
        console.log(shout("aetheros"));
    }
}
;
export class RouteStore {
    constructor() {
        this.root = new Node();
        this.routeMap = {};
    }
    insert(path) {
        let node = this.root;
        let parts = path.split('/').filter(Boolean);
        for (let part of parts) {
            // If its a dynamic segment (:id or :slug)
            if (part.startsWith(':') || part === '*') {
                if (!node.children[part]) {
                    node.children[part] = new Node();
                }
                node = node.children[part];
                continue;
            }
            // If its a static segment (/user or /dashboard)
            let stat = '';
            for (let char of part) {
                if (!node.children[char]) {
                    node.children[char] = new Node();
                }
                node = node.children[char];
                stat += char;
            }
            this.routeMap[stat] = node;
        }
        node.eor = true;
    }
    search(path) {
        let node = this.root;
        let parts = path.split('/').filter(Boolean);
        let params = {};
        let url = '';
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            // Check if part exists in the hashmap (static)
            if (this.routeMap[part]) {
                node = this.routeMap[part];
                url += `/${part}`;
                continue;
            }
            // For dynamic segments
            let dynamicKey = Object.keys(node.children).find(key => key.startsWith(":"));
            if (dynamicKey) {
                params[dynamicKey.substring(1)] = part;
                url += `/${dynamicKey}`;
                node = node.children[dynamicKey];
                continue;
            }
            // Check for wildcards (*)
            if (node.children['*']) {
                let wildcardNode = node.children['*'];
                // Traverse until we find a static match or finish the path
                while (i < parts.length - 1) {
                    let nextPart = parts[i + 1];
                    let foundStatic = Object.keys(this.routeMap).includes(nextPart);
                    if (foundStatic)
                        break; // Stop if we find a static match
                    i++; // Keep consuming parts if no static match found
                }
                url += '/*';
                node = wildcardNode; // Move to wildcard node
                continue;
            }
            return null;
        }
        // If we reached the end of the path and it's a valid endpoint, return params
        return node.eor ? { params, url } : null;
    }
}
