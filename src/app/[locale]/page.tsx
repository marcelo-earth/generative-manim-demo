import Homepage from "@/components/homepage";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "@/components/logo.png";
import Switcher from "@/components/Main";
import Button from "@/components/Button";
import TryAnimo from "@/components/TryAnimo";

export default function Home() {
  const t = useTranslations("Index");
  const p = useTranslations("Page");
  const m = useTranslations("Main");
  
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
                Main: {
                  inputPromptVideo: m("inputPromptVideo"),
                  inputPlaceholder: m("inputPlaceholder"),
                  generating: m("generating"),
                  generate: m("generate"),
                  renderFromCode: m("renderFromCode"),
                  video: m("video"),
                  rendering: m("rendering"),
                  render: m("render"),
                  inputCodeRender: m("inputCodeRender"),
                  inputPromptCode: m("inputPromptCode"),
                  copy: m("copy"),
                  download: m("download"),
                  modelGroups: {
                    openai: m("modelGroups.openai"),
                    claude: m("modelGroups.claude"),
                    deepseek: m("modelGroups.deepseek")
                  },
                  models: {
                    gpt4: m("models.gpt4"),
                    gpt35FineTuned: m("models.gpt35FineTuned"),
                    gpt35Physics: m("models.gpt35Physics"),
                    claude35: m("models.claude35"),
                    claude3: m("models.claude3"),
                    deepseekR1: m("models.deepseekR1")
                  },
                  feedbackThanks: m("feedbackThanks")
                }
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
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mt-2" id="how-it-works">
              <span role="img" aria-label="⚡️">⚡️</span>{" "}
              {p("howItWorks")}
            </h2>
            <p className="text-lg lg:text-xl text-neutral-500 dark:text-neutral-300 my-2">
              {p("makingAccessible")}
            </p>
            <p>{p("toolDescription")}</p>
            <ul className="list-disc list-inside">
              <li><b>Generate Video:</b> {p("parts.generateVideo")}</li>
              <li><b>Render Engine:</b> {p("parts.renderEngine")}</li>
              <li><b>Prompt Generator:</b> {p("parts.promptGenerator")}</li>
            </ul>
            <p>{p("generateVideoExplanation")}</p>
            
            <h3 className="text-xl lg:text-2xl my-2 font-semibold tracking-tight">
              <span role="img" aria-label="💡">💡</span>{" "}
              {p("concept")}
            </h3>
            <p>{p("conceptDescription")}</p>
            <p>{p("futureIsNow")}</p>
            <p>{p("manimDescription")}</p>
          </section>
          <section className="text-left max-w-screen-lg mx-auto p-2">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mt-2" id="contributors">
              <span role="img" aria-label="💻">💻</span>{" "}
              {p("models")}
            </h2>
            <p className="text-lg lg:text-xl text-neutral-500 dark:text-neutral-300 my-2">
              {p("modelsDescription")}
            </p>
            <p>{p("modelsIntro")}</p>
            
            <div className="flex flex-col lg:flex-row gap-4 my-6">
              <div className="flex flex-col border dark:border-neutral-700 dark:hover:border-rose-300 transition lg:w-4/12 p-5 rounded-lg hover:scale-105">
                <h3 className="text-xl lg:text-2xl my-2 font-semibold tracking-tight" id="gpt-4o">
                  🤖 {p("modelCards.gpt4.title")}
                </h3>
                <p>{p("modelCards.gpt4.description")}</p>
              </div>
              <div className="flex flex-col border dark:border-neutral-700 dark:hover:border-rose-300 transition lg:w-4/12 p-5 rounded-lg hover:scale-105">
                <h3 className="text-xl lg:text-2xl my-2 font-semibold tracking-tight" id="gpt-3.5">
                  📡 GPT-3.5 Fine-Tuned
                </h3>
                <p>
                  We trained a GPT-3.5 model with a few examples of Manim code.
                  The model is fine-tuned to generate Manim code from a prompt.
                  This model is a little bit slower than GPT-4o.
                </p>
              </div>
              <div className="flex flex-col border dark:border-neutral-700 dark:hover:border-rose-300 transition lg:w-4/12 p-5 rounded-lg hover:scale-105">
                <h3 className="text-xl lg:text-2xl my-2 font-semibold tracking-tight" id="other-models">
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
              {p("haveIdea")}{" "}
              <a
                href="https://discord.gg/HkbYEGybGv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                {p("contributorLinks.discord")}
              </a>{" "}
              {p("joinDiscord")}
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
              {p("contributors")}
            </h2>
            <p className="text-lg lg:text-xl text-neutral-500 dark:text-neutral-300 my-2">
              {p("contributorsDescription")}
            </p>
            <p>
              {p("contributorsText")}{" "}
              <a
                href="https://github.com/marcelo-earth/generative-manim/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-300 underline-offset-4"
              >
                {p("contributorLinks.pullRequests")}
              </a>{" "}
            </p>
            <p>{p("joinDiscord")}</p>
            <ul className="list-disc list-inside">
              <li>
                <a
                  href="https://github.com/marcelo-earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-rose-300 underline-offset-4"
                >
                  {p("contributorLinks.contributors.marcelo")}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Puiching-Memory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-rose-300 underline-offset-4"
                >
                  {p("contributorLinks.contributors.puiching")}
                </a>
              </li>
            </ul>
            <h4 className="text-lg lg:text-xl font-semibold tracking-tight mt-2">How to contribute</h4>
            <p>
              You can contribute to the project by submitting a pull request on GitHub.
            </p>
          </section>
        </div>
      </main>
      <footer className="bg-white md:flex dark:bg-neutral-900 border border-t-neutral-200 dark:border-t-neutral-800 border-transparent mt-12">
        <div className="m-auto max-w-screen-lg md:py-4 flex w-full flex-col justify-center md:flex-row md:justify-between">
          <div className="mx-auto w-full max-w-screen-lg p-4 py-6 lg:py-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-300 text-center">
              {p("footer")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
