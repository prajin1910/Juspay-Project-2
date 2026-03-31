package com.juspay.backend.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String upiId;
    private String walletId;
    private Set<Role> roles;

    // constructors
    public User() {}

    public User(String name, String email, String phone, String password, String upiId, String walletId, Set<Role> roles) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.upiId = upiId;
        this.walletId = walletId;
        this.roles = roles;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getWalletId() { return walletId; }
    public void setWalletId(String walletId) { this.walletId = walletId; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}
