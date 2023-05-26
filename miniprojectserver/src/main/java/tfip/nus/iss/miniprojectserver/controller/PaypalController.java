package tfip.nus.iss.miniprojectserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import tfip.nus.iss.miniprojectserver.models.Order;
import tfip.nus.iss.miniprojectserver.service.PaypalService;

@Controller
@RequestMapping
public class PaypalController {

    @Autowired
    private PaypalService paypalService;

    @PostMapping(path="/api/payment")
    @ResponseBody
    public ResponseEntity<String> payment(
        
        @RequestBody Order order)
    {
        
        try{
            Payment payment = paypalService.createPayment(order.getPrice(), order.getCurrency(), 
                                    order.getMethod(), order.getIntent(), order.getDescription(), 
                                    "https://fiinder.up.railway.app/pay/cancel", "https://fiinder.up.railway.app/pay/success");
            String paymentId = payment.getId();
            for(Links link : payment.getLinks()){
                if (link.getRel().equals("approval_url")){
                    JsonObject json = Json.createObjectBuilder()
                                .add("link", link.getHref())
                                .add("paymentId", paymentId)
                                .build();
                    return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
                }
            }
        } catch (PayPalRESTException e){
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(null);
    }

    @GetMapping(path="/pay/cancel")
    public ResponseEntity<String> cancel(){
        return ResponseEntity.status(HttpStatus.OK)
        .contentType(MediaType.APPLICATION_JSON)
        .body("Payment failed");
    }

    @GetMapping(path="/pay/success")
    public ResponseEntity<String> success(
        @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId){
        JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
        try{
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")){
                return ResponseEntity.status(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(jsonBuilder.add("paymentStatus", "approved").build().toString());
            }
        } catch (PayPalRESTException e){
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonBuilder.add("paymentStatus", "failed").build().toString());
            
        }
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonBuilder.add("paymentStatus", "failed").build().toString());
    }

    @GetMapping(path="api/payment/getpaymentstatus/{paymentId}")
    @ResponseBody
    public ResponseEntity<String> getPaymentStatus(
        @PathVariable String paymentId
    ){

        try {
            Payment payment = paypalService.getPaymentDetails(paymentId);
            System.out.println(payment);
            if (payment.getState().equals("approved")){
                JsonObject json = Json.createObjectBuilder()
                                .add("paymentStatus", "approved")
                                .build();
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
            }
        } catch (PayPalRESTException e){
            JsonObject json = Json.createObjectBuilder()
                                .add("paymentStatus", "restexception")
                                .build();
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
        }        
        JsonObject json = Json.createObjectBuilder()
                                .add("paymentStatus", "rejected")
                                .build();
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
        }
}

    
