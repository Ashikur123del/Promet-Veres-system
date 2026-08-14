const DEFAULT_THUMBNAIL =
  "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800";

export async function uploadThumbnail(file, existingUrl = "") {
  if (!file) {
    return existingUrl || DEFAULT_THUMBNAIL;
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    return DEFAULT_THUMBNAIL;
  }

  const imageFormData = new FormData();
  imageFormData.append("image", file);

  const imgbbRes = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    { method: "POST", body: imageFormData }
  );
  const imgbbData = await imgbbRes.json();

  if (!imgbbData.success) {
    throw new Error(imgbbData?.error?.message || "Image upload failed");
  }

  return imgbbData.data.url;
}
