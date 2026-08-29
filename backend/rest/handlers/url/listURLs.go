package url

import (
	"fmt"
	"net/http"
	"url-shortener/domain"
	"url-shortener/util"
)

func (h *Handler) ListURLs(w http.ResponseWriter, r *http.Request) {
	urls, err := h.svc.FindAll()

	if err != nil {
		fmt.Println("FindAll error:", err)
		util.SendError(w, http.StatusInternalServerError, "failed to fetch URLs")
		return
	}

	if urls == nil {
		urls = []domain.URL{}
	}

	util.SendData(w, http.StatusOK, urls)
}
