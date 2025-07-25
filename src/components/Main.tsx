"use client";
import { useHotkeys } from "react-hotkeys-hook";

import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import {
  CodeIcon,
  Copy,
  Download,
  Earth,
  Loader2,
  PackagePlus,
  Save,
  Send,
  ThumbsDown,
  ThumbsUp,
  Video,
  VideoIcon,
  WandSparkles,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useChat } from "ai/react";
import Select from "./Select";
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

const Switcher = ({ translations }: { translations?: any }) => {
  const [topBar, setTopBar] = useState<"main" | "render" | "prompt" | "dataset">("main");
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [promptToCode, setPromptToCode] = useState("");
  const [codeToVideo, setCodeToVideo] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [promptToCodeModel, setPromptToCodeModel] = useState("gpt-4o");
  const [promptToCodeResult, setPromptToCodeResult] = useState("");
  const [promptToCodeLoading, setPromptToCodeLoading] = useState(false);
  const [renderizationLoading, setRenderizationLoading] = useState(false);
  const [currentVideoURL, setCurrentVideoURL] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<
    "POSITIVE" | "NEGATIVE" | null
  >(null);
  const [hasFeedbackBeenGiven, setHasFeedbackBeenGiven] = useState(false);
  const [showContributePrompt, setShowContributePrompt] = useState(true);
  const [hasAcceptedContribute, setHasAcceptedContribute] = useState(false);
  const [contributionLoading, setContributionLoading] = useState(false);
  const [datasetItems, setDatasetItems] = useState<any[]>([]);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  useHotkeys("mod+enter", (e) => {
    e.preventDefault();
    if (topBar === "main") {
      handleVideoGeneration(e as unknown as React.FormEvent<HTMLFormElement>);
    } else if (topBar === "render") {
      handleRenderization(e as unknown as React.FormEvent<HTMLFormElement>);
    } else if (topBar === "prompt") {
      handleCodeGeneration(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  });

  useHotkeys("shift+1", (e) => {
    e.preventDefault();
    if (isFeedbackEnabled()) {
      provideFeedback("POSITIVE");
    }
  });

  useHotkeys("shift+2", (e) => {
    e.preventDefault();
    if (isFeedbackEnabled()) {
      provideFeedback("NEGATIVE");
    }
  });

  const cleaner = (code: string) => {
    const cleaned = code.replace(/```python/g, "").replace(/```/g, "");
    return cleaned;
  };

  const handleVideoGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRenderizationLoading(true);
    setFeedbackStatus(null);
    setHasFeedbackBeenGiven(false);
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

      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PROCESSOR}/v1/video/rendering`,
        {
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
        }
      );

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
    setFeedbackStatus(null);
    setHasFeedbackBeenGiven(false);
    try {
      const iteration = Math.floor(Math.random() * 1000000);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PROCESSOR}/v1/video/rendering`,
        {
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
        }
      );
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
    setFeedbackStatus(null);
    setHasFeedbackBeenGiven(false);
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
    if (hasFeedbackBeenGiven) {
      return false;
    }

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
    if (hasFeedbackBeenGiven) {
      return;
    }

    setFeedbackStatus(feedback);
    setHasFeedbackBeenGiven(true);

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
        model: topBar === "render" ? "-" : promptToCodeModel,
      }),
    });
    // TODO: Add a tooltip to the button that says "We have recorded your feedback. Thank you!"
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribeLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subscriberName,
          email: subscriberEmail,
        }),
      });

      if (response.ok) {
        alert("Successfully subscribed!");
        setSubscriberName("");
        setSubscriberEmail("");
      } else {
        alert("Error subscribing. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error subscribing. Please try again.");
    } finally {
      setSubscribeLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user has a dark mode preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);

    // Check if user has already accepted to contribute
    const hasAccepted = localStorage.getItem('hasAcceptedContribute') === 'true';
    setHasAcceptedContribute(hasAccepted);
    setShowContributePrompt(!hasAccepted);

    return () => {};
  }, []);

  const handleAcceptContribute = () => {
    localStorage.setItem('hasAcceptedContribute', 'true');
    setHasAcceptedContribute(true);
    setShowContributePrompt(false);
  };

  useEffect(() => {
    if (topBar === "dataset") {
      fetchDataset();
    }
  }, [topBar]);

  const fetchDataset = async () => {
    setIsLoadingDataset(true);
    try {
      const response = await fetch('/api/dataset');
      const data = await response.json();
      console.log('Dataset received:', data);
      // Map the data to match our expected structure
      const formattedData = data.map((item: any) => ({
        timestamp: item.Timestamp,
        prompt: item.Prompt,
        code: item.Code,
        video_url: item["Video URL"],  // Note the space in column name
        model: item.Model,
        feedback: item.Feedback
      }));
      
      setDatasetItems(formattedData.filter((item: any) => 
        item.code && item.video_url && item.prompt
      ));
    } catch (error) {
      console.error('Error fetching dataset:', error);
    } finally {
      setIsLoadingDataset(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col lg:flex-row bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        <button
          className={classNames(
            "p-2 w-full lg:w-4/12 text-sm lg:text-base rounded-lg transition flex gap-x-2 items-center justify-center",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "main",
            }
          )}
          onClick={() => setTopBar("main")}
        >
          <VideoIcon className="w-5 h-5" />
          {translations?.generateVideo}
        </button>
        <button
          className={classNames(
            "p-2 w-full lg:w-4/12 text-sm lg:text-base rounded-lg transition flex gap-x-2 items-center justify-center",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "render",
            }
          )}
          onClick={() => setTopBar("render")}
        >
          <Earth className="w-5 h-5" />
          {translations?.renderEngine}
        </button>
        <button
          className={classNames(
            "p-2 w-full lg:w-4/12 text-sm lg:text-base rounded-lg transition flex gap-x-2 items-center justify-center",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "prompt",
            }
          )}
          onClick={() => setTopBar("prompt")}
        >
          <CodeIcon className="w-5 h-5" />
          {translations?.promptGenerator}
        </button>
        <button
          className={classNames(
            "p-2 w-full lg:w-3/12 text-sm lg:text-base rounded-lg transition flex gap-x-2 items-center justify-center",
            {
              "bg-white dark:bg-neutral-900 shadow": topBar === "dataset",
            }
          )}
          onClick={() => setTopBar("dataset")}
        >
          <Save className="w-5 h-5" />
          {translations?.dataset || "Dataset"}
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
                  autoFocus
                />
                <Select
                  name="model"
                  id="model"
                  value={promptToCodeModel}
                  onChange={(e) => setPromptToCodeModel(e.target.value)}
                >
                  <optgroup label={translations?.Main?.modelGroups?.openai}>
                    <option value="gpt-4o">
                      {translations?.Main?.models?.gpt4}
                    </option>
                    <option value="ft:gpt-3.5-turbo-1106:astronware:generative-manim-2:9OeVevto">
                      {translations?.Main?.models?.gpt35FineTuned}
                    </option>
                    <option value="ft:gpt-3.5-turbo-1106:astronware:gm-physics-01:9hr68Zu9">
                      {translations?.Main?.models?.gpt35Physics}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.claude}>
                    <option value="claude-sonnet-4-20250514">
                      Claude Sonnet 4
                    </option>
                    <option value="claude-3-7-sonnet-20250219">
                      Claude 3.7 Sonnet
                    </option>
                    <option value="claude-3-5-sonnet-20240620">
                      {translations?.Main?.models?.claude35}
                    </option>
                    <option value="claude-3-sonnet-20240229">
                      {translations?.Main?.models?.claude3}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.deepseek}>
                    <option value="deepseek-r1">
                      {translations?.Main?.models?.deepseekR1}
                    </option>
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
                  className="mt-2 w-full rounded-t-lg"
                ></video>
                <div
                  className={classNames(
                    "flex gap-x-2 justify-between items-center p-4 pl-6 transition-all border-neutral-300 dark:border-neutral-800 rounded-b-lg bg-neutral-100 dark:bg-neutral-900"
                  )}
                >
                  <span>Does the animation match the prompt?</span>
                  <div className="flex gap-x-2">
                    <button
                      className={classNames(
                        "p-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed",
                        {
                          "bg-green-200 dark:bg-green-700": feedbackStatus === "POSITIVE",
                          "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600":
                            feedbackStatus !== "POSITIVE",
                        }
                      )}
                      onClick={() => provideFeedback("POSITIVE")}
                      disabled={!isFeedbackEnabled()}
                    >
                      <ThumbsUp />
                    </button>
                    <button
                      className={classNames(
                        "p-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed",
                        {
                          "bg-red-200 dark:bg-red-700": feedbackStatus === "NEGATIVE",
                          "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600":
                            feedbackStatus !== "NEGATIVE",
                        }
                      )}
                      onClick={() => provideFeedback("NEGATIVE")}
                      disabled={!isFeedbackEnabled()}
                    >
                      <ThumbsDown />
                    </button>
                  </div>
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
                  className="mt-2 w-full rounded-t-lg"
                ></video>
                {showContributePrompt ? (
                  <div className={classNames(
                    "flex flex-col gap-y-2 p-4 pl-6 transition-all border-neutral-300 dark:border-neutral-800 rounded-b-lg bg-neutral-100 dark:bg-neutral-900"
                  )}>
                    <span>Would you like to contribute to Generative Manim Dataset?<br /> Tell us what each animation is about</span>
                    <Button
                      className="px-6 flex gap-x-2 items-center justify-center"
                      onClick={handleAcceptContribute}
                    >
                      <PackagePlus />
                      <span>Start contributing</span>
                    </Button>
                  </div>
                ) : hasAcceptedContribute && (
                  <div className={classNames(
                    "flex flex-col gap-y-2 gap-x-2 justify-between items-start p-4 pl-6 transition-all border-neutral-300 dark:border-neutral-800 rounded-b-lg bg-neutral-100 dark:bg-neutral-900"
                  )}>
                    <span id="feedback-description">
                      What is the animation about?
                    </span>
                    <div className="flex gap-x-2 w-full">
                      <TextareaAutosize
                        className="transition block w-full p-2 text-gray-900 border-2 border-gray-300 rounded-lg bg-neutral-50 focus:border-rose-400 focus:ring-rose-200 focus:ring-4 focus:border-purple-medium dark:bg-black/30 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-rose-400/40 dark:focus:border-purple-medium outline-none flex-grow"
                        placeholder="Describe the animation"
                        id="feedback-description"
                        value={feedbackDescription}
                        onChange={(e) => setFeedbackDescription(e.target.value)}
                      />
                    </div>
                    <Button
                      className="px-6 flex gap-x-2 items-center justify-center mt-2"
                      disabled={contributionLoading}
                      onClick={async (e) => {
                        e.preventDefault();
                        setContributionLoading(true);
                        try {
                          const response = await fetch("/api/record-feedback", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              feedback: "POSITIVE",
                              code: codeToVideo,
                              video_url: currentVideoURL,
                              timestamp: new Date().toISOString(),
                              prompt: promptToCode,
                              model: "-",
                              feedback_description: feedbackDescription
                            }),
                          });
                          
                          if (response.ok) {
                            setFeedbackDescription(""); // Clear the form after successful submission
                          }
                        } catch (error) {
                          console.error('Error submitting contribution:', error);
                        } finally {
                          setContributionLoading(false);
                        }
                      }}
                    >
                      {contributionLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <PackagePlus />
                      )}
                      <span>{contributionLoading ? "Contributing..." : "Contribute"}</span>
                    </Button>
                  </div>
                )}
                <div
                  className={classNames(
                    "flex gap-x-2 py-2 justify-center transition-all",
                    {
                      "opacity-0": !isFeedbackEnabled(),
                    }
                  )}
                >
                  <button
                    className={classNames(
                      "p-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed",
                      {
                        "bg-green-200 dark:bg-green-700":
                          feedbackStatus === "POSITIVE",
                        "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600":
                          feedbackStatus !== "POSITIVE",
                      }
                    )}
                    onClick={() => provideFeedback("POSITIVE")}
                    disabled={!isFeedbackEnabled()}
                  >
                    <ThumbsUp />
                  </button>
                  <button
                    className={classNames(
                      "p-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed",
                      {
                        "bg-red-200 dark:bg-red-700":
                          feedbackStatus === "NEGATIVE",
                        "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600":
                          feedbackStatus !== "NEGATIVE",
                      }
                    )}
                    onClick={() => provideFeedback("NEGATIVE")}
                    disabled={!isFeedbackEnabled()}
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
                  autoFocus
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
                    <option value="gpt-4o">
                      {translations?.Main?.models?.gpt4}
                    </option>
                    <option value="ft:gpt-3.5-turbo-1106:astronware:generative-manim-2:9OeVevto">
                      {translations?.Main?.models?.gpt35FineTuned}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.claude}>
                    <option value="claude-sonnet-4-20250514">
                      Claude Sonnet 4
                    </option>
                    <option value="claude-3-5-sonnet-20240620">
                      {translations?.Main?.models?.claude35}
                    </option>
                    <option value="claude-3-sonnet-20240229">
                      {translations?.Main?.models?.claude3}
                    </option>
                  </optgroup>
                  <optgroup label={translations?.Main?.modelGroups?.deepseek}>
                    <option value="deepseek-r1">
                      {translations?.Main?.models?.deepseekR1}
                    </option>
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
                    className={classNames(
                      "p-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed",
                      {
                        "bg-green-200 dark:bg-green-700":
                          feedbackStatus === "POSITIVE",
                        "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600":
                          feedbackStatus !== "POSITIVE",
                      }
                    )}
                    onClick={() => provideFeedback("POSITIVE")}
                    disabled={!isFeedbackEnabled()}
                  >
                    <ThumbsUp />
                  </button>
                  <button
                    className={classNames(
                      "p-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed",
                      {
                        "bg-red-200 dark:bg-red-700":
                          feedbackStatus === "NEGATIVE",
                        "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600":
                          feedbackStatus !== "NEGATIVE",
                      }
                    )}
                    onClick={() => provideFeedback("NEGATIVE")}
                    disabled={!isFeedbackEnabled()}
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
        {topBar === "dataset" && (
          <div className="w-full mt-6 max-w-7xl mx-auto">
            {isLoadingDataset ? (
              <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : datasetItems.length > 0 ? (
              <div className="w-full space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1 text-left flex gap-x-2 flex-col items-start justify-start">
                    <h2 className="text-2xl font-semibold">
                      Dataset Explorer
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Example <input 
                        type="number" 
                        min="1" 
                        max={datasetItems.length}
                        value={currentDatasetIndex + 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setCurrentDatasetIndex(Math.min(Math.max(val - 1, 0), datasetItems.length - 1));
                        }}
                        className="w-16 px-2 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      /> of {datasetItems.length}
                      <button
                        onClick={() => {
                          const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                          const val = parseInt(input.value) || 1;
                          setCurrentDatasetIndex(Math.min(Math.max(val - 1, 0), datasetItems.length - 1));
                        }}
                        className="ml-2 px-4 py-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-md text-neutral-600 dark:text-white"
                      >
                        Check
                      </button>
                    </p>
                  </div>
                  <div className="flex gap-x-3">
                    <button
                      onClick={() => setCurrentDatasetIndex(prev => 
                        prev === 0 ? datasetItems.length - 1 : prev - 1
                      )}
                      className="px-6 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition border border-neutral-300 dark:border-neutral-700"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setCurrentDatasetIndex(prev => 
                        prev === datasetItems.length - 1 ? 0 : prev + 1
                      )}
                      className="px-6 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition border border-neutral-300 dark:border-neutral-700"
                    >
                      Next →
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-x-3">
                        <h3 className="text-lg font-medium">Prompt</h3>
                        <div className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs">
                          Input
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm text-left">
                          {datasetItems[currentDatasetIndex]?.prompt || 'No prompt available'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center gap-x-3">
                        <h3 className="text-lg font-medium">Code</h3>
                        <div className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs">
                          Python
                        </div>
                      </div>
                      <Editor
                        height="40vh"
                        defaultLanguage="python"
                        options={{
                          fontSize: 14,
                          wordWrap: "on",
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                        }}
                        theme={isDarkMode ? "vs-dark" : "vs-light"}
                        className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"
                        value={datasetItems[currentDatasetIndex]?.code || '# No code available'}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-x-3">
                        <h3 className="text-lg font-medium">Result</h3>
                        <div className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs">
                          Video
                        </div>
                      </div>
                      {datasetItems[currentDatasetIndex]?.video_url ? (
                        <video
                          key={datasetItems[currentDatasetIndex].video_url}
                          src={datasetItems[currentDatasetIndex].video_url}
                          controls
                          className="w-full aspect-video rounded-xl bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <div className="w-full aspect-video flex items-center justify-center rounded-xl bg-neutral-900 text-neutral-400">
                          No video available
                        </div>
                      )}
                    </div>

                    <div className="p-5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                      <div className="flex items-center gap-x-4">
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm font-medium">Model:</span>
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {datasetItems[currentDatasetIndex]?.model || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />
                      
                      <div className="flex items-center gap-x-3">
                        <span className="text-sm font-medium">Feedback:</span>
                        {datasetItems[currentDatasetIndex]?.feedback === "POSITIVE" ? (
                          <div className="flex items-center gap-x-1.5 text-green-600 dark:text-green-400">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Positive</span>
                          </div>
                        ) : datasetItems[currentDatasetIndex]?.feedback === "NEGATIVE" ? (
                          <div className="flex items-center gap-x-1.5 text-red-600 dark:text-red-400">
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-sm font-medium">Negative</span>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-500">No feedback</span>
                        )}
                      </div>

                      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

                      <div className="flex items-center gap-x-2">
                          <span className="text-sm font-medium">Date:</span>
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {datasetItems[currentDatasetIndex]?.timestamp ? 
                              new Date(datasetItems[currentDatasetIndex].timestamp).toLocaleString() : 
                              'Unknown'}
                          </span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[60vh]">
                <p className="text-neutral-600 dark:text-neutral-400">No dataset items available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Switcher;
