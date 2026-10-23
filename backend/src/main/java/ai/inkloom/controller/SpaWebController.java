package ai.inkloom.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    @GetMapping(value = {
        "/",
        "/overview",
        "/studio",
        "/findings",
        "/queue",
        "/sources",
        "/rules",
        "/audit",
        "/settings"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
