## ADDED Requirements

### Requirement: Teks captcha dalam dua bahasa
Kamus `id` dan `en` SHALL memuat `contact.form.captchaNotice` (teks atribusi reCAPTCHA dengan placeholder tautan `{privacy}` dan `{terms}`), `contact.form.captchaPrivacy` ("Kebijakan Privasi"/"Privacy Policy"), `contact.form.captchaTerms` ("Persyaratan Layanan"/"Terms of Service"), dan `MESSAGES_*.captcha` ("Verifikasi gagal. Muat ulang halaman dan coba lagi." / "Verification failed. Reload the page and try again."), dengan kunci yang identik di kedua kamus.

#### Scenario: Kunci lengkap
- **WHEN** uji kamus dijalankan
- **THEN** kunci `captchaNotice`, `captchaPrivacy`, `captchaTerms` ada di `id` dan `en`, dan `captchaNotice` memuat `{privacy}` serta `{terms}`
