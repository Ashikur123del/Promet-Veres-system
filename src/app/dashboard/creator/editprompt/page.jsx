"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  TextField,
  Label,
  InputGroup,
  FieldError,
  Select,
  ListBox,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { FiType, FiTag, FiImage } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const CATEGORIES = ["Coding", "Writing", "Copywriting", "Graphics & Image", "Legal", "Other"];
const AI_TOOLS = ["ChatGPT", "Gemini", "Claude", "Midjourney", "Stable Diffusion", "Other"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];

const EditPromptPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState(new Set(["Coding"]));
  const [aiTool, setAiTool] = useState(new Set(["ChatGPT"]));
  const [difficulty, setDifficulty] = useState(new Set(["Beginner"]));
  const [visibility, setVisibility] = useState("public");
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // ---- পুরনো prompt ডেটা লোড করে ফর্ম pre-fill করা ----
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/${id}`);
        const data = await res.json();
        setPrompt(data);
        setCategory(new Set([data.category]));
        setAiTool(new Set([data.aiTool]));
        setDifficulty(new Set([data.difficulty]));
        setVisibility(data.visibility);
      } catch (error) {
        toast.error("Failed to load prompt");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPrompt();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { title, description, content, tags } = Object.fromEntries(formData.entries());

    setIsSubmitting(true);

    try {
      // ---- নতুন থাম্বনেইল আপলোড হলে imgbb-তে পাঠাও, না হলে পুরনো URL-ই রাখো ----
      let thumbnailUrl = prompt.thumbnail;
      if (thumbnailFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", thumbnailFile);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imageFormData }
        );
        const imgbbData = await imgbbRes.json();
        if (!imgbbData.success) throw new Error("Image upload failed");
        thumbnailUrl = imgbbData.data.url;
      }

      const updatedPrompt = {
        title,
        description,
        content,
        category: [...category][0],
        aiTool: [...aiTool][0],
        difficulty: [...difficulty][0],
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        thumbnail: thumbnailUrl,
        visibility,
      };

      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPrompt),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update prompt");

      toast.success("Prompt updated! It will go through admin review again.");
      router.push("/dashboard/my-prompt");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-96 max-w-2xl animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }

  if (!prompt) {
    return <p className="p-6 text-muted">Prompt not found.</p>;
  }

  // ⚠️ মালিক না হলে এডিট করতে দেওয়া হবে না (UI-level চেক — সার্ভারেও ownership ভেরিফাই হয়)
  if (currentUser && prompt.creatorEmail !== currentUser.email) {
    return <p className="p-6 text-danger">You don&apos;t have permission to edit this prompt.</p>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Prompt</h1>
        <p className="mt-1 text-sm text-muted">
          Updating a prompt sends it back for admin review.
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
        <TextField name="title" type="text" defaultValue={prompt.title} isRequired>
          <Label>Prompt Title</Label>
          <InputGroup>
            <InputGroup.Prefix>
              <FiType className="text-muted" size={16} />
            </InputGroup.Prefix>
            <InputGroup.Input />
          </InputGroup>
          <FieldError />
        </TextField>

        <TextField name="description" defaultValue={prompt.description} isRequired>
          <Label>Prompt Description</Label>
          <InputGroup>
            <InputGroup.Input isMultiline rows={2} />
          </InputGroup>
          <FieldError />
        </TextField>

        <TextField name="content" defaultValue={prompt.content} isRequired>
          <Label>Prompt Content</Label>
          <InputGroup>
            <InputGroup.Input isMultiline rows={6} />
          </InputGroup>
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Select selectedKeys={category} onSelectionChange={setCategory}>
            <Label>Category</Label>
            <Select.Trigger className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {CATEGORIES.map((c) => (
                  <ListBox.Item key={c} id={c} textValue={c}>
                    {c}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select selectedKeys={aiTool} onSelectionChange={setAiTool}>
            <Label>AI Tool</Label>
            <Select.Trigger className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {AI_TOOLS.map((t) => (
                  <ListBox.Item key={t} id={t} textValue={t}>
                    {t}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select selectedKeys={difficulty} onSelectionChange={setDifficulty}>
            <Label>Difficulty</Label>
            <Select.Trigger className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {DIFFICULTIES.map((d) => (
                  <ListBox.Item key={d} id={d} textValue={d}>
                    {d}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <TextField name="tags" defaultValue={prompt.tags?.join(", ")}>
          <Label>Tags (comma separated)</Label>
          <InputGroup>
            <InputGroup.Prefix>
              <FiTag className="text-muted" size={16} />
            </InputGroup.Prefix>
            <InputGroup.Input />
          </InputGroup>
          <FieldError />
        </TextField>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Thumbnail Image (leave empty to keep current)
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-4 py-3 text-sm text-muted hover:border-accent/50">
            <FiImage size={16} />
            {thumbnailFile ? thumbnailFile.name : "Click to upload a new image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <RadioGroup value={visibility} onChange={setVisibility} orientation="horizontal">
          <Label>Visibility</Label>
          <Radio value="public">Public</Radio>
          <Radio value="private">Private (Premium)</Radio>
        </RadioGroup>

        <Button
          type="submit"
          variant="primary"
          radius="full"
          className="mt-2 w-fit"
          isDisabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Form>
    </div>
  );
};

export default EditPromptPage;