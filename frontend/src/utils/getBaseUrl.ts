export default function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    return "http://localhost:4000";
  }
}
