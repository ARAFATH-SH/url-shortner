package url

import (
	"database/sql"
	"fmt"
	"net/http"
	"url-shortener/util"
)

func (h *Handler) GetURL(w http.ResponseWriter, r *http.Request) {
	shortCode := r.PathValue("short_code")

	url, err := h.svc.FindByShortCode(shortCode)

	if err != nil {
		fmt.Println("FindByShortCode error:", err)
		if err == sql.ErrNoRows {
			util.SendError(w, http.StatusNotFound, "URL not found")
			return
		}

		util.SendError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	http.Redirect(w, r, url.OriginalURL, http.StatusFound)
}
