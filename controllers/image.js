const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);

const handleImage = (knex) => (req, res) => {

    const { id } = req.body;

    knex('users')
        .where('id', '=', id)
        .increment('entries')
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => {
            res.status(400).json('unable to get entries');
        })

}

const handleImageUrl = (req, res) => {

    const { imageurl } = req.body;

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available Face detection model. You may use any other public or custom model ID.
            model_id: "d02b4508df58432fbb84e800597b8959",
            inputs: [{ data: { image: { url: imageurl } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return res.status(500).json("server error");
            }

            if (response.status.code !== 10000) {
                return res.status(400).json("Received failed status: " + response.status.description + "\n" + response.status.details);
            }

            if (response.outputs[0].data.regions.length) {
                res.json(response.outputs[0].data.regions);
            } else {
                res.json("no face detected!");
            }

        }
    );
}

module.exports = {
    handleImage: handleImage,
    handleImageUrl: handleImageUrl
}