const express = require('express');
const bodyParser = require('body-parser');
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');

const app = express();
const port = 3000;
const ig = new IgApiClient();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        ig.state.generateDevice(username);
        await ig.account.login(username, password);

        res.json({ success: true });

        await postAboutUs();
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

async function postImage(imagePath, caption) {
    const imageBuffer = fs.readFileSync(imagePath);

    const upload = await ig.publish.photo({
        file: imageBuffer,
        caption: caption,
    });

    console.log('Image uploaded successfully');
}

async function postAboutUs() {
    const aboutUsCaption = `🌟 Welcome to Our Instagram Page! 🌟\n\n`
                        + `We are a team dedicated to [describe your purpose or mission].\n`
                        + `Follow us for updates and inspiration!\n\n`
                        + `#AboutUs #Mission #Inspiration`;

    await postImage('image/a.jpg', aboutUsCaption);
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
