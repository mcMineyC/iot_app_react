import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/integrations", "routes/integrations.jsx")
];
