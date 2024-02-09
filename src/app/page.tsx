import {Prediction} from "@/types";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {unstable_noStore as noStore} from "next/cache";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HomePage() {
  async function createPrediction(formData: FormData) {
    "use server";

    noStore();

    let prediction = await fetch("https://replicate.com/api/predictions", {
      "headers": {
        "accept": "application/json",
        "accept-language": "es-419,es;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrftoken": "YUqgjpjijUEyv7DVvwRXeVnVykpVPWPx"
      },
      "referrer": "https://replicate.com/jagilley/controlnet-hough",
      "referrerPolicy": "same-origin",
      "body": JSON.stringify({
        input: {
          eta: 0,
          image: "https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png",
          scale: 9,
          prompt: "an industrial bedroom",
          a_prompt: "best quality, extremely detailed",
          n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
          ddim_steps: 20,
          num_samples: 1,
          value_threshold: 0.1,
          image_resolution: 512,
          detect_resolution: 512,
          distance_threshold: 0.1
        },
        is_training: false,
        create_model: "0",
        stream: false,
        version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b"
      }),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then((res) => res.json() as Promise<Prediction>);

    while (["starting", "processing"].includes(prediction.status)) {
      prediction = await fetch("https://replicate.com/api/predictions/" + prediction.id, {
        "headers": {
          "accept": "*/*",
          "accept-language": "es-419,es;q=0.9",
          "baggage": "sentry-public_key=3dc017e574684610bbc7fd3b5519a4e8,sentry-trace_id=7a2c09d6bb454bb7aa664610c2d4eaf7,sentry-sample_rate=0.1",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "\"Android\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sentry-trace": "7a2c09d6bb454bb7aa664610c2d4eaf7-bb6255f0513bb28f-0"
        },
        "referrer": "https://replicate.com/jagilley/controlnet-hough",
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then((res) => res.json() as Promise<Prediction>) ;

      console.log(prediction);

      await sleep(4000);
    }

    console.log(prediction);
  }


  return (
    <form action={createPrediction} className="grid gap-4 max-w-[512px] gap-4 m-auto">
      <Input
        defaultValue="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        name="image"
        placeholder="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        type="text"
      />
      <Textarea placeholder="An industrial bedroom" name="prompt" />
      <Button>Create</Button>
    </form>
  );
}
