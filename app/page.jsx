import Wrapper from "@/layout/Wrapper";
import Home from "@/app/website/home/LandingPage";

export const metadata = {
  title: "Domesta ",
  description: "Domesta - Listing Borad",
};

export default function page() {
  return (
    <Wrapper>
      <Home />
    </Wrapper>
  );
}
