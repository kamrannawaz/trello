import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
  return (
    <div className="w-full">
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: {
              width: "100%",
              boxShadow: "none",
            },
            card: {
              boxShadow: "none",
              border: "1px solid #e5e5e5",
              width: "100%",
            }
          },
        }}
      />
    </div>
  );
};

export default SettingsPage;
