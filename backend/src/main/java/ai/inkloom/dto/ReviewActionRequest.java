package ai.inkloom.dto;

import ai.inkloom.model.ReviewDecision;
import jakarta.validation.constraints.NotNull;

public class ReviewActionRequest {
    @NotNull(message = "Decision is required")
    private ReviewDecision.DecisionType decision;

    private String finalCorrection;
    private String notes;

    public ReviewDecision.DecisionType getDecision() { return decision; }
    public void setDecision(ReviewDecision.DecisionType decision) { this.decision = decision; }

    public String getFinalCorrection() { return finalCorrection; }
    public void setFinalCorrection(String finalCorrection) { this.finalCorrection = finalCorrection; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
