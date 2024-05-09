// 1 x 256 Texture to sample it's colors.
uniform sampler2D colorTex;

varying float finalDisplacement;
varying float displacement;

// Basic random function for pseudo random value.
float random( vec3 scale, float seed ){
    return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

    // Random value to add a bit of randomness to the color.
    float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 10.0 );

    // Color value based on displacement and corrected to be within texture coordinates.
    vec3 color = texture(colorTex, vec2(.0,(abs((finalDisplacement - displacement) / 21.0)) + r)).rgb;

    // Setting color, leaving alpha channel intact.
    gl_FragColor = vec4( color, 1.0 );

    // Color correction.
    #include <colorspace_fragment>
}
