vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    
    return a + b * cos(6.28318 * (c * t + d));
}

float stars(vec2 uv, float t) {
    uv *= 50.0;
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    float n = fract(sin(dot(id, vec2(27.619, 57.583))) * 43758.5453);
    float d = length(gv);
    float star = smoothstep(0.05, 0.0, d) * step(0.995, n);
    return star * (0.5 + 0.5*sin(t*10.0 + n*6.28318));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    float t = iTime * 0.5;

    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
        float angle = t * 0.3 + i;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        uv = rot * uv * 1.5 + 0.2 * sin(t * 0.3);

        float d = length(uv) * exp(-length(uv0));
        
        vec3 col = palette(length(uv0) + i * 0.4 + t * 0.6);

        d = sin(d * 8.0 + t) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.3);

        finalColor += col * d;
    }

    finalColor = pow(finalColor, vec3(0.8));

    float st = stars(uv0, iTime);
    finalColor += vec3(st);

    fragColor = vec4(finalColor, 1.0);
}
