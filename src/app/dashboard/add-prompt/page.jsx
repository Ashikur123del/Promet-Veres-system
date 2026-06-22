"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

const AddPromptPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [category, setCategory] = useState(new Set(["Coding"]));
  const [aiTool, setAiTool] = useState(new Set(["ChatGPT"]));
  const [difficulty, setDifficulty] = useState(new Set(["Beginner"]));
  const [visibility, setVisibility] = useState("public");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to add a prompt.");
      return;
    }

    // ⚠️ FormData অবশ্যই প্রথম await-এর আগে নিতে হবে, না হলে React event object
    // stale হয়ে যায় আর e.currentTarget পরে null হয়ে FormData ক্র্যাশ করে
    const formData = new FormData(e.currentTarget);
    const { title, description, content, tags } = Object.fromEntries(formData.entries());

    setIsSubmitting(true);

    try {
      // ---- ১) thumbnail ইমেজ imgbb-তে আপলোড ----
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", thumbnailFile);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imageFormData }
        );
        const imgbbData = await imgbbRes.json();

        if (!imgbbData.success) {
          console.error("imgbb error response:", imgbbData); // আসল কারণ কনসোলে দেখাবে
          throw new Error(imgbbData?.error?.message || "Image upload failed");
        }
        thumbnailUrl = imgbbData.data.url;
      }

      // ---- ২) প্রম্পট অবজেক্ট তৈরি ----
      const newPrompt = {
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
        creatorEmail: currentUser.email,
        creatorName: currentUser.name,
        creatorId: currentUser.id,
      };

      // ---- ৩) JWT সহ protected রুটে POST ----
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPrompt),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add prompt");
      }

      toast.success("Prompt submitted! It will appear after admin approval.");
      router.push("/dashboard/my-prompt");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add New Prompt</h1>
        <p className="mt-1 text-sm text-muted">
          New prompts go through admin review before appearing in the marketplace.
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
        <TextField name="title" type="text" isRequired>
          <Label>Prompt Title</Label>
          <InputGroup>
            <InputGroup.Prefix>
              <FiType className="text-muted" size={16} />
            </InputGroup.Prefix>
            <InputGroup.Input placeholder="e.g. SaaS Pricing Page Copywriter" />
          </InputGroup>
          <FieldError />
        </TextField>

        <TextField name="description" isRequired>
          <Label>Prompt Description</Label>
          <InputGroup>
            <InputGroup.Input
              isMultiline
              rows={2}
              placeholder="A short summary of what this prompt does"
            />
          </InputGroup>
          <FieldError />
        </TextField>

        <TextField name="content" isRequired>
          <Label>Prompt Content</Label>
          <InputGroup>
            <InputGroup.Input
              isMultiline
              rows={6}
              placeholder="The full prompt text that users will copy"
            />
          </InputGroup>
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* ---- Category ---- */}
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

          {/* ---- AI Tool ---- */}
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

          {/* ---- Difficulty ---- */}
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

        <TextField name="tags">
          <Label>Tags (comma separated)</Label>
          <InputGroup>
            <InputGroup.Prefix>
              <FiTag className="text-muted" size={16} />
            </InputGroup.Prefix>
            <InputGroup.Input placeholder="e.g. react, frontend, tailwind" />
          </InputGroup>
          <FieldError />
        </TextField>

        {/* ---- Thumbnail upload ---- */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Thumbnail Image</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-4 py-3 text-sm text-muted hover:border-accent/50">
            <FiImage size={16} />
            {thumbnailFile ? thumbnailFile.name : "Click to upload an image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* ---- Visibility ---- */}
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
          {isSubmitting ? "Submitting..." : "Submit Prompt"}
        </Button>
      </Form>
    </div>
  );
};

export default AddPromptPage;