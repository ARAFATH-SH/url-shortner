package url

import (
	"database/sql"
	"errors"
	"net/http"
	"url-shortener/util"
)

func (h *Handler) DeleteURL(w http.ResponseWriter, r *http.Request) {
	shortCode := r.PathValue("short_code")

	err := h.svc.Delete(shortCode)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			util.SendError(w, http.StatusNotFound, "URL not found")
			return
		}

		util.SendError(w, http.StatusInternalServerError, "failed to delete URL")
		return
	}

	util.SendData(w, http.StatusNoContent, "Successfully deleted URL")
}
