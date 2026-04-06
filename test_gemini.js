const key = "?key=AIzaSyAFSJnj-luZ8FfLF_TlBWvMxejeyqRi0I4";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent${key}`;
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
      systemInstruction: { parts: [{ text: "You are a test" }] },
      contents: [{ parts: [{ text: "hello" }] }]
  })
}).then(async r => {
  console.log('Status 2.5-flash:', r.status);
  console.log('Response:', await r.text());
});
