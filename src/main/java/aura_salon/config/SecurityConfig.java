package aura_salon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder) {

        UserDetails admin = User
                .withUsername("admin")
                .password(passwordEncoder.encode("AuraAdmin@2026"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Customer - create appointment
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments"
                        ).permitAll()

                        // Customer - check appointment status
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments/status/**"
                        ).permitAll()

                        // Allow browser preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Admin APIs
                        .requestMatchers(
                                "/api/appointments/**"
                        ).hasRole("ADMIN")

                        // Everything else
                        .anyRequest().permitAll()
                )

                .httpBasic(httpBasic -> {});

        return http.build();
    }
}