import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import InfluencerList from "./components/InfluencerList";
import Settings from "./components/Settings";
import InfluencerDetail from "./components/InfluencerDetail";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/influencers" element={<InfluencerList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/influencer/:id" element={<InfluencerDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
