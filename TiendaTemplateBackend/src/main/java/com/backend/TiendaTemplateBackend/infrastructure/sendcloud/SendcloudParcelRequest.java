package com.backend.TiendaTemplateBackend.infrastructure.sendcloud;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
public class SendcloudParcelRequest {

    private Parcel parcel;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
    public static class Parcel {
        @com.fasterxml.jackson.annotation.JsonProperty("name")
        private String name;
        @com.fasterxml.jackson.annotation.JsonProperty("company_name")
        private String company_name;
        @com.fasterxml.jackson.annotation.JsonProperty("address")
        private String address;
        @com.fasterxml.jackson.annotation.JsonProperty("city")
        private String city;
        @com.fasterxml.jackson.annotation.JsonProperty("postal_code")
        private String postal_code;
        @com.fasterxml.jackson.annotation.JsonProperty("telephone")
        private String telephone;
        @com.fasterxml.jackson.annotation.JsonProperty("email")
        private String email;
        @com.fasterxml.jackson.annotation.JsonProperty("country")
        private String country;
        @com.fasterxml.jackson.annotation.JsonProperty("weight")
        private String weight;
        @com.fasterxml.jackson.annotation.JsonProperty("request_label")
        private Boolean request_label;
        @com.fasterxml.jackson.annotation.JsonProperty("shipping_method")
        private Integer shipping_method;
    }
}
