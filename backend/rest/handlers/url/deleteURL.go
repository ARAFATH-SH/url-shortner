package url

import (
	"net/http"
	"url-shortener/util"
)

func (h *Handler) DeleteURL(w http.ResponseWriter, r *http.Request) {
	shortCode := r.PathValue("short_code")

	err := h.svc.Delete(shortCode)

	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "failed to delete URL")
		return
	}

	util.SendData(w, http.StatusCreated, "Successfully deleted URL")
}
