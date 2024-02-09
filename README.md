Kind Code	Meaning	Example
N	New property in rhs not in lhs	{ "kind": "N", "path": ["key5"], "rhs": true }
D	Property in lhs not in rhs	{ "kind": "D", "path": ["key6"], "lhs": "oldValue" }
E	Property value is different in lhs and rhs	{ "kind": "E", "path": ["key7"], "lhs": "oldValue", "rhs": "newValue" }
A	Array changes, sub-differences possible	{ "kind": "A", "path": ["array", 1], "index": 1, "item": { "kind": "E", "lhs": 2, "rhs": 3 } }
