/*
 * Copyright (c) 2025 Patrick Taburet
 * This file is licensed under the MIT License.
 * See the LICENSE file in the root directory for more details.
 */

import p5 from "p5";

let p5Instance: p5 | null = null;


export function setP5Instance(p: p5) {
  p5Instance = p;
}

export function getP5Instance(): p5 {
    if (!p5Instance) throw new Error("p5 instance not set.");
    return p5Instance;
}