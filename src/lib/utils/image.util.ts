export const toBase64 = (image: File): string | undefined => {
  let result: string | undefined;
  if (!image) {
    return undefined;
  }
  const fr = new FileReader()
  fr.readAsDataURL(image);
  fr.onload = () => {
    result = fr.result?.valueOf().toString();
  }
  return result;
}