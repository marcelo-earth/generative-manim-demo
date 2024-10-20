import Homepage from "@/components/homepage";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "@/components/logo.png";
import Switcher from "@/components/Main";
import Button from "@/components/Button";
import TryAnimo from "@/components/TryAnimo";

export default function Home() {
  const t = useTranslations("Index");
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center w-full bg-white dark:bg-neutral-950 dark:text-white">
        <div className="text-center gap-y-4 px-0 lg:px-24 w-full">
          <Image
            src={Logo}
            alt="Generative Manim logo"
            className="w-24 lg:w-32 h-24 lg:h-32 mx-auto mt-12"
          />
          <div className="flex flex-col gap-y-2 w-full mt-2.5">
            <h1
              className="text-4xl lg:text-5xl font-semibold tracking-tight"
              itemProp="title"
            >
              Generative Manim
            </h1>
            <p
              className="text-xl lg:text-2xl text-rose-400 dark:text-rose-200"
              itemProp="subheading"
            >
              {t("pageDescription")}
            </p>
          </div>
          <section
            className="max-w-screen-lg mx-auto p-2"
            itemProp="description"
          >
            {t("pageDetailedDescription")}
          </section>
          <section className="max-w-screen-lg mx-auto p-2">
            <Switcher
              translations={{
                generateVideo: t("generateVideo"),
                renderEngine: t("renderEngine"),
                promptGenerator: t("promptGenerator"),
              }}
            />
          </section>
          <section className="max-w-screen-lg mx-auto p-2">
            <div className="flex flex-row gap-y-2 bg-neutral-50 dark:bg-neutral-900 border dark:border-rose-400 p-6 rounded-lg">
              <div className="flex flex-col text-left lg:w-9/12">
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
                  {t("callToActionTitle")}
                </h2>
                <p>
                  {t.rich("callToActionDescription", {
                    link: (chunks) => (
                      <a
                        href="https://animo.video"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-rose-300 underline-offset-4"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
              <div className="flex lg:w-3/12">
                <div className="flex justify-end items-center w-full">
                  <TryAnimo tryAnimoLabel={t("tryAnimo")} />
                </div>
              </div>
            </div>
          </section>
          <section className="text-left max-w-screen-lg mx-auto p-2">
            <h2
              className="text-2xl lg:text-3xl font-bold tracking-tight mt-2"
              id="how-it-works"
            >
              <span role="img" aria-label="⚡️">
                ⚡️
              </span>{" "}
              How it works
            </h2>
            <p className="text-lg lg:text-xl text-neutral-500 dark:text-neutral-300 my-2">
              Making video animations accessible to everyone.{" "}
            </p>
            <p>
              Generative Manim is an open-source tool for generating animation
              videos from text. It is divided in three parts:
            </p>
            <ul className="list-disc list-inside">
              <li>
                <b>Generate Video:</b> Generate the video from the text.
              </li>
              <li>
                <b>Render Engine:</b> Render the video from the code.
              </li>
              <li>
                <b>Prompt Generator:</b> Generate the code from the text.
              </li>
            </ul>
            <p>
              The <b>Generate Video</b> part is the sum of the{" "}
              <b>Prompt Generator</b> and the <b>Render Engine</b> in a single
              step.
            </p>
            <h3 className="text-xl lg:text-2xl my-2 font-semibold tracking-tight">
              <span role="img" aria-label="💡">
                💡
              </span>{" "}
              Concept
            </h3>
            <p>
              Imagine a future where you can watch an animation video from a
              concept you have in your mind in a few seconds. That would be
              useful for teachers, students, and more. People that want to
              generate a video won&apos;t need to learn how to use a video
              editor, how to draw, or how to code. You just need to write a
              descriptive text.
            </p>
            <p>
              That indeed is a future. And it is not that far. We can already
              start working on it.
            </p>
            <p>
              Manim is a Python library for creating complex graphics and
              animations. The main advantage of Manim for GPT, it&apos;s that
              since it&apos;s a language for the LLM, it&apos;s more easy to
              generate proper code from a prompt.
            </p>
          </section>
          <section className="text-left max-w-screen-lg mx-auto p-2">
            <h2
              className="text-2xl lg:text-3xl font-bold tracking-tight mt-2"
              id="contributors"
            >
              <span role="img" aria-label="💻">
                💻
              </span>{" "}
              Models
            </h2>
            <p className="text-lg lg:text-xl text-neutral-500 dark:text-neutral-300 my-2">
              The models we use to generate Manim code from text.
            </p>
            <p>
              Generative Manim uses models to generate code from text. The first
              model we used was <b>GPT-4</b> with a <b>Zero Shot Learning</b>{" "}
              strategy. Today we are using two models.
            </p>
            <div className="flex flex-col lg:flex-row gap-4 my-6">
              <div className="flex flex-col border dark:border-neutral-700 dark:hover:border-rose-300 transition lg:w-4/12 p-5 rounded-lg hover:scale-105">
                <h3
                  className="text-xl lg:text-2xl my-2 font-semibold tracking-tight"
                  id="gpt-4o"
                >
                  🤖 GPT-4o
                </h3>
                <p>
                  GPT-4o is the next-generation model from OpenAI. We use a
                  basic system prompt to generate the code. We add a few extra
                  instructions to help the model understand the task.
                </p>
              </div>
              <div className="flex flex-col border dark:border-neutral-700 dark:hover:border-rose-300 transition lg:w-4/12 p-5 rounded-lg hover:scale-105">
                <h3
                  className="text-xl lg:text-2xl my-2 font-semibold tracking-tight"
                  id="gpt-3.5"
                >
                  📡 GPT-3.5 Fine-Tuned
                </h3>
                <p>
                  We trained a GPT-3.5 model with a few examples of Manim code.
                  The model is fine-tuned to generate Manim code from a prompt.
                  This model is a little bit slower than GPT-4o.
                </p>
              </div>
              <div className="flex flex-col border dark:border-neutral-700 dark:hover:border-rose-300 transition lg:w-4/12 p-5 rounded-lg hover:scale-105">
                <h3
                  className="text-xl lg:text-2xl my-2 font-semibold tracking-tight"
                  id="other-models"
                >
                  💡 GPT-3.5 Fine-Tuned for Physics
                </h3>
                <p>
                  A GPT-3.5 model fined-tuned to generate Manim for the{" "}
                  <a
                    href="https://manim-physics.readthedocs.io/en/latest/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-rose-300 underline-offset-4"
                  >
                    Manim Physics
                  </a>{" "}
                  plugin.
                </p>
              </div>
            </div>
            <p>
              If you have an idea or want to help us, go to our{" "}
              <a
                href="https://discord.gg/HkbYEGybGv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                Discord Community
              </a>{" "}
              and let us know.
            </p>
          </section>
          <section className="text-left max-w-screen-lg mx-auto p-2">
            <h2
              className="text-2xl lg:text-3xl font-bold tracking-tight mt-2"
              id="contributors"
            >
              <span role="img" aria-label="🚀">
                🚀
              </span>{" "}
              Contributors
            </h2>
            <p className="text-lg lg:text-xl text-neutral-500 dark:text-neutral-300 my-2">
              Awesome people that are contributing to the project.
            </p>
            <p>
              Generative Manim is an open source project. You can contribute to
              the project by suggesting new features, fixing bugs, or improving
              the documentation.{" "}
              <a
                href="https://github.com/360macky/generative-manim/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                Pull Requests
              </a>{" "}
              are warmly welcome.
            </p>
            <p>
              Remember you can also join our{" "}
              <a
                href="https://discord.gg/HkbYEGybGv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                Discord Community
              </a>{" "}
              to discuss new features, bugs or any other topic.
            </p>
            <ul className="list-disc list-inside">
              <li>
                <a
                  href="https://github.com/360macky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-rose-300 underline-offset-4"
                >
                  Marcelo Arias @360macky
                </a>{" "}
              </li>
              <li>
                <a
                  href="https://github.com/Puiching-Memory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-rose-300 underline-offset-4"
                >
                  梦归云帆 @Puiching-Memory
                </a>{" "}
              </li>
            </ul>
          </section>
        </div>
      </main>
      <footer className="bg-white md:flex dark:bg-neutral-900 border border-t-neutral-200 dark:border-t-neutral-800 border-transparent mt-12">
        <div className="m-auto max-w-screen-lg md:py-4 flex w-full flex-col justify-center md:flex-row md:justify-between">
          <div className="mx-auto w-full max-w-screen-lg p-4 py-6 lg:py-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-300 text-center">
              Made by the{" "}
              <a
                href="https://discord.gg/HkbYEGybGv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                Generative Manim Community
              </a>{" "}
              and{" "}
              <a
                href="https://animo.video"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                Animo
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
