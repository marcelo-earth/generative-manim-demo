"use client";

import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import {
  Copy,
  Download,
  Loader2,
  ThumbsDown,
  ThumbsUp,
  Video,
  WandSparkles,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useChat } from "ai/react";
import Select from "./Select";

const Switcher = ({ translations }: { translations?: any }) => {
  const [topBar, setTopBar] = useState<"main" | "render" | "prompt">("main");
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [promptToCode, setPromptToCode] = useState("");
  const [codeToVideo, setCodeToVideo] = useState("");
  const [promptToCodeModel, setPromptToCodeModel] = useState("gpt-4o");
  const [promptToCodeResult, setPromptToCodeResult] = useState("");
  const [promptToCodeLoading, setPromptToCodeLoading] = useState(false);
  const [renderizationLoading, setRenderizationLoading] = useState(false);
  const [currentVideoURL, setCurrentVideoURL] = useState("");

  const cleaner = (code: string) => {
    const cleaned = code.replace(/```python/g, "").replace(/```/g, "");
    return cleaned;
  };

  const handleVideoGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRenderizationLoading(true);
    // Use handleCodeGeneration and handleRenderization in sequence
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PROCESSOR}/v1/code/generation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: promptToCode,
            model: promptToCodeModel,
          }),
        }
      );
      const data = await response.json();
      const code = cleaner(data.code);
      setCodeToVideo(code);
      const iteration = Math.floor(Math.random() * 1000000);

      const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PROCESSOR}/v1/video/rendering`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          file_name: "GenScene.py",
          file_class: "GenScene",
          iteration,
          project_name: "GenScene",
        }),
      });

      const data2 = await response2.json();
      const { video_url } = data2;
      setCurrentVideoURL(video_url);
    } catch (error) {
      console.error(error);
    } finally {
      setRenderizationLoading(false);
    }
  };

  const handleRenderization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRenderizationLoading(true);
    try {
      const iteration = Math.floor(Math.random() * 1000000);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PROCESSOR}/v1/video/rendering`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeToVideo,
          file_name: "GenScene.py",
          file_class: "GenScene",
          iteration,
          project_name: "GenScene",
        }),
      });
      const data = await response.json();
      const { video_url } = data;
      setCurrentVideoURL(video_url);
    } catch (error) {
      console.error(error);
    } finally {
      setRenderizationLoading(false);
    }
  };

  const handleCodeGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    setPromptToCodeLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PROCESSOR}/v1/code/generation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: promptToCode,
            model: promptToCodeModel,
          }),
        }
      );
      const data = await response.json();
      setPromptToCodeResult(cleaner(data.code));
    } catch (error) {
      console.error(error);
    } finally {
      setPromptToCodeLoading(false);
    }
  };

  const isFeedbackEnabled = (): boolean => {
    if (topBar === "main") {
      return (
        promptToCode !== "" && codeToVideo !== "" && currentVideoURL !== ""
      );
    } else if (topBar === "render") {
      return codeToVideo !== "" && currentVideoURL !== "";
    } else if (topBar === "prompt") {
      return promptToCode !== "" && promptToCodeResult !== "";
    }
    return false;
  };

  const provideFeedback = async (feedback: "POSITIVE" | "NEGATIVE") => {
    const response = await fetch("/api/record-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback,
        code: codeToVideo,
        video_url: currentVideoURL,
        timestamp: new Date().toISOString(),
        prompt: promptToCode,
        model: promptToCodeModel,
      }),
    });
    alert(translations?.Main?.feedbackThanks || "We have recorded your feedback. Thank you!");
  };

  useEffect(() => {
    // Check if the user has a dark mode preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);

    return () => {};
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col lg:flex-row bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        <button
          className={classNames(
            "p-2 w-full lg:w-4/12 text-sm lg:text-base rounded-lg transition",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "main",
            }
          )}
          onClick={() => setTopBar("main")}
        >
          {translations?.generateVideo}
        </button>
        <button
          className={classNames(
            "p-2 w-full lg:w-4/12 text-sm lg:text-base rounded-lg transition",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "render",
            }
          )}
          onClick={() => setTopBar("render")}
        >
          {translations?.renderEngine}
        </button>
        <button
          className={classNames(
            "p-2 w-full lg:w-4/12 text-sm lg:text-base rounded-lg transition",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "prompt",
            }
          )}
          onClick={() => setTopBar("prompt")}
        >
          {translations?.promptGenerator}
        </button>
      </div>
      <div className="w-full min-h-[40vh]">
        {topBar === "main" && (
          <div className="w-full">
            <form className="w-full mt-4" onSubmit={handleVideoGeneration}>
              <label htmlFor="prompt" className="text-left">
                {translations?.Main?.inputPromptVideo}
              </label>
              <div className="flex flex-col lg:flex-row gap-x-2 gap-y-2 mt-2">
                <Input
                  id="prompt"
                  type="text"
                  placeholder={translations?.Main?.inputPlaceholder}
                  className="lg:w-96"
                  value={promptToCode}
                  onChange={(e) => setPromptToCode(e.target.value)}
                />
                <Select
                  name="model"
                  id="model"
                  value={promptToCodeModel}
                  onChange={(e) => setPromptToCodeModel(e.target.value)}
                >
                  <optgroup label={translations?.Main?.modelGroups?.openai}>
                    <option value="gpt-4o">{translations?.Main?.models?.gpt4}</option>
                    <option value="ft:gpt-3.5-turbo-1106:astronware:generative-manim-2:9OeVevto">
                      {translations?.Main?.models?.gpt35FineTuned}
                    </option>
                    <option value="ft:gpt-3.5-turbo-1106:astronware:gm-physics-01:9hr68Zu9">
                      {translations?.Main?.models?.gpt35Physics}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.claude}>
                    <option value="claude-3-5-sonnet-20240620">
                      {translations?.Main?.models?.claude35}
                    </option>
                    <option value="claude-3-sonnet-20240229">
                      {translations?.Main?.models?.claude3}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.deepseek}>
                    <option value="deepseek-r1">{translations?.Main?.models?.deepseekR1}</option>
                  </optgroup>
                </Select>
                <Button
                  className="px-4 flex gap-x-2 items-center justify-center"
                  disabled={renderizationLoading}
                >
                  {renderizationLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <WandSparkles />
                  )}
                  <span>
                    {renderizationLoading 
                      ? translations?.Main?.generating 
                      : translations?.Main?.generate}
                  </span>
                </Button>
              </div>
            </form>
            <div className="flex flex-col lg:flex-row gap-x-4 mt-2">
              <div className="w-full lg:w-6/12">
                <label htmlFor="code" className="text-left">
                  Render a video from code
                </label>
                <div className="mt-2">
                  <Editor
                    height="40vh"
                    defaultLanguage="python"
                    options={{
                      fontSize: 14,
                      wordWrap: "on",
                    }}
                    theme={isDarkMode ? "vs-dark" : "vs-light"}
                    className="border border-neutral-300 dark:border-neutral-800 rounded-lg"
                    value={codeToVideo}
                    onChange={(value) => {
                      setCodeToVideo(value || "");
                    }}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12">
                <label htmlFor="code" className="text-left">
                  Video
                </label>
                <video
                  src={currentVideoURL}
                  controls
                  className="mt-2 w-full rounded-lg"
                ></video>
                <div
                  className={classNames(
                    "flex gap-x-2 py-2 justify-center transition-all",
                    {
                      "opacity-0": !isFeedbackEnabled(),
                    }
                  )}
                >
                  <button
                    className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:ring-4 active:ring-neutral-400 dark:active:ring-neutral-500 transition"
                    onClick={() => provideFeedback("POSITIVE")}
                  >
                    <ThumbsUp />
                  </button>
                  <button
                    className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:ring-4 active:ring-neutral-400 dark:active:ring-neutral-500 transition"
                    onClick={() => provideFeedback("NEGATIVE")}
                  >
                    <ThumbsDown />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {topBar === "render" && (
          <div className="w-full">
            <form
              className="w-full flex flex-col lg:flex-row gap-x-4 mt-4"
              onSubmit={handleRenderization}
            >
              <div className="w-full lg:w-6/12">
                <label htmlFor="code" className="text-left">
                  Input the code to render a video
                </label>
                <div className="mt-2">
                  <Editor
                    height="40vh"
                    defaultLanguage="python"
                    options={{
                      fontSize: 14,
                      wordWrap: "on",
                    }}
                    theme={isDarkMode ? "vs-dark" : "vs-light"}
                    className="border border-neutral-300 dark:border-neutral-800 rounded-lg"
                    value={codeToVideo}
                    onChange={(value) => {
                      setCodeToVideo(value || "");
                    }}
                  />
                  <Button
                    className="px-6 flex gap-x-2 items-center justify-center mt-2"
                    disabled={renderizationLoading}
                  >
                    {renderizationLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Video />
                    )}
                    <span>
                      {renderizationLoading ? "Rendering..." : "Render"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-6/12">
                <label htmlFor="code" className="text-left">
                  Video
                </label>
                <video
                  src={currentVideoURL}
                  controls
                  className="mt-2 w-full rounded-lg"
                ></video>
                <div
                  className={classNames(
                    "flex gap-x-2 py-2 justify-center transition-all",
                    {
                      "opacity-0": !isFeedbackEnabled(),
                    }
                  )}
                >
                  <button
                    className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:ring-4 active:ring-neutral-400 dark:active:ring-neutral-500 transition"
                    onClick={() => provideFeedback("POSITIVE")}
                  >
                    <ThumbsUp />
                  </button>
                  <button
                    className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:ring-4 active:ring-neutral-400 dark:active:ring-neutral-500 transition"
                    onClick={() => provideFeedback("NEGATIVE")}
                  >
                    <ThumbsDown />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {topBar === "prompt" && (
          <div className="w-full">
            <form className="w-full mt-4" onSubmit={handleCodeGeneration}>
              <label htmlFor="prompt" className="text-left">
                Input the prompt to generate code
              </label>
              <div className="flex flex-col lg:flex-row gap-x-2 gap-y-2 mt-2">
                <Input
                  id="prompt"
                  type="text"
                  placeholder="Draw a red circle and transform it into a square"
                  className="lg:w-96"
                  value={promptToCode}
                  onChange={(e) => setPromptToCode(e.target.value)}
                />
                <Select
                  name="model"
                  id="model"
                  value={promptToCodeModel}
                  onChange={(e) => setPromptToCodeModel(e.target.value)}
                >
                  <optgroup label={translations?.Main?.modelGroups?.openai}>
                    <option value="gpt-4o">{translations?.Main?.models?.gpt4}</option>
                    <option value="ft:gpt-3.5-turbo-1106:astronware:generative-manim-2:9OeVevto">
                      {translations?.Main?.models?.gpt35FineTuned}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.claude}>
                    <option value="claude-3-5-sonnet-20240620">
                      {translations?.Main?.models?.claude35}
                    </option>
                    <option value="claude-3-sonnet-20240229">
                      {translations?.Main?.models?.claude3}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.deepseek}>
                    <option value="deepseek-r1">{translations?.Main?.models?.deepseekR1}</option>
                  </optgroup>
                </Select>
                <Button
                  className="px-4 flex gap-x-2 items-center justify-center"
                  disabled={promptToCodeLoading}
                >
                  {promptToCodeLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <WandSparkles />
                  )}
                  <span>
                    {promptToCodeLoading 
                      ? translations?.Main?.generating 
                      : translations?.Main?.generate}
                  </span>
                </Button>
              </div>
            </form>
            <div className="mt-2">
              <Editor
                height="40vh"
                defaultLanguage="python"
                options={{
                  fontSize: 14,
                  wordWrap: "on",
                }}
                theme={isDarkMode ? "vs-dark" : "vs-light"}
                className="border border-neutral-300 dark:border-neutral-800 rounded-lg"
                value={promptToCodeResult}
                onChange={(value) => {
                  setPromptToCodeResult(value || "");
                }}
              />
              <div className="flex justify-between">
                <Button
                  className="px-6 flex gap-x-2 items-center justify-center mt-2"
                  disabled={!promptToCodeResult}
                  onClick={() => {
                    navigator.clipboard.writeText(promptToCodeResult);
                  }}
                >
                  <Copy />
                  <span>Copy</span>
                </Button>
                <div
                  className={classNames(
                    "flex gap-x-2 py-2 justify-center transition-all",
                    {
                      "opacity-0": !isFeedbackEnabled(),
                    }
                  )}
                >
                  <button
                    className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:ring-4 active:ring-neutral-400 dark:active:ring-neutral-500 transition"
                    onClick={() => provideFeedback("POSITIVE")}
                  >
                    <ThumbsUp />
                  </button>
                  <button
                    className="p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:ring-4 active:ring-neutral-400 dark:active:ring-neutral-500 transition"
                    onClick={() => provideFeedback("NEGATIVE")}
                  >
                    <ThumbsDown />
                  </button>
                </div>
                <Button
                  className="px-6 flex gap-x-2 items-center justify-center mt-2"
                  disabled={!promptToCodeResult}
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([promptToCodeResult], {
                      type: "text/plain",
                    });
                    element.href = URL.createObjectURL(file);
                    element.download =
                      promptToCode.toLowerCase().split(" ").join("-") + ".py";
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                    document.body.removeChild(element);
                  }}
                >
                  <Download />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Switcher;
