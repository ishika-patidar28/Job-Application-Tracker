package com.example.job_application_tracker.security;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String SECRET = Base64.getEncoder().encodeToString(
            "01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8));

    @Test
    void generatesTokenWithUsernameAndExpiration() {
        JwtService jwtService = new JwtService(SECRET, 60_000);

        var claims = jwtService.parseClaims(jwtService.generateToken("tester"));

        assertEquals("tester", claims.getSubject());
        assertTrue(claims.getExpiration().getTime() > claims.getIssuedAt().getTime());
    }

    @Test
    void rejectsTokenSignedWithAnotherKey() {
        JwtService issuer = new JwtService(SECRET, 60_000);
        String otherSecret = Base64.getEncoder().encodeToString(
                "abcdefghijabcdefghijabcdefghij12".getBytes(StandardCharsets.UTF_8));
        JwtService verifier = new JwtService(otherSecret, 60_000);

        assertThrows(JwtException.class, () -> verifier.parseClaims(issuer.generateToken("tester")));
    }
}
