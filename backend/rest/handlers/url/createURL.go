package url

import (
	"encoding/json"
	"fmt"
	"net/http"
	"url-shortener/domain"
	"url-shortener/util"
)

type CreateURL struct {
	OriginalURL string `json:"original_url"`
}

func (h *Handler) CreateURL(w http.ResponseWriter, r *http.Request) {
	var req CreateURL

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)

	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Please give me valid json")
		return
	}

	createdUrl, err := h.svc.Create(domain.URL{
		OriginalURL: req.OriginalURL,
	})

	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	util.SendData(w, http.StatusCreated, createdUrl)
}
