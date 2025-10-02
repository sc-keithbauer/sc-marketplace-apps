"use client";

import { useEffect, useState } from "react";
import { useMarketplaceClient } from "@/src/utils/hooks/useMarketplaceClient";
import {
  ApplicationContext,
  PagesContext,
} from "@sitecore-marketplace-sdk/client";

function CustomFieldExtension() {
  const { client, isInitialized, error } = useMarketplaceClient();
  const [appContext, setAppContext] = useState<ApplicationContext>();
  const [pagesContext, setPagesContext] = useState<PagesContext>();

  const [value, setValue] = useState<string>("");

  // Preset options as buttons
  const options = [
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Option E",
    "Option F",
    "Option G",
    "Option H",
    "Option I",
    "Option J",
    "Option K",
    "Option L",
    "Option M",
    "Option N",
    "Option O",
    "Option P",
    "Option Q",
    "Option R",
    "Option S",
    "Option T",
    "Option U",
    "Option V",
    "Option W",
    "Option X",
    "Option Y",
    "Option Z",
  ];

  useEffect(() => {
    if (!error && isInitialized && client) {
      console.log("Marketplace client initialized successfully.");
      // Make a query to retrieve the application context
      client
        .query("application.context")
        .then((res) => {
          console.log("Success retrieving application.context:", res.data);
          setAppContext(res.data);
        })
        .catch((error) => {
          console.error("Error retrieving application.context:", error);
        });

      client
        .query("pages.context")
        .then((res) => {
          console.log("Success retrieving pages.context:", res.data);
          setPagesContext(res.data);
        })
        .catch((error) => {
          console.error("Error retrieving pages.context:", error);
        });

      fetchValue();
    } else if (error) {
      console.error("Error initializing Marketplace client:", error);
    }
  }, [client, error, isInitialized]);

  const fetchValue = async () => {
    if (!client) return;

    const latest = await client.getValue();
    if (latest && typeof latest === "string") {
      setValue(latest);
    }
  };

  const handleClick = (selected: string) => {
    setValue(selected);
    if (client) client.setValue(selected);
    setTimeout(() => client?.closeApp(), 1000);
  };

  return (
    <div>
      {isInitialized ? (
        <div>
          <h1>Welcome to {appContext?.name}</h1>
          <p>This is a custom field extension.</p>
          <p>Latest value: {value}</p>

          <div className="application-context">
            <h3>Application Context:</h3>
            <ul className="context-details">
              <li>
                <strong>Name:</strong> {appContext?.name}
              </li>
              <li>
                <strong>ID:</strong> {appContext?.id}
              </li>
              <li>
                <strong>Icon URL:</strong> {appContext?.iconUrl}
              </li>
              <li>
                <strong>Installation ID:</strong> {appContext?.installationId}
              </li>
              <li>
                <strong>State:</strong> {appContext?.state}
              </li>
              <li>
                <strong>Type:</strong> {appContext?.type}
              </li>
              <li>
                <strong>URL:</strong> {appContext?.url}
              </li>
            </ul>
          </div>

          <div className="custom-field-extension">
            <p>Click a button to set the value.</p>
            {options.map((opt) => (
              <button
                key={opt}
                style={{
                  padding: "10px 20px",
                  margin: "10px",
                  backgroundColor: value === opt ? "#0078d4" : "#eee",
                  color: value === opt ? "#fff" : "#000",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onClick={() => handleClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {pagesContext && (
            <div className="pages-context">
              <h3>Pages Context:</h3>
              <ul className="context-details">
                {Object.keys(pagesContext).map((key) => (
                  <li key={key}>
                    <pre>
                      <strong>{key}:</strong>{" "}
                      {typeof pagesContext?.[key] !== "string"
                        ? JSON.stringify(pagesContext?.[key], null, 2)
                        : pagesContext?.[key]}
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Initializing extension...</p>
      )}
      {error && <p style={{ color: "red" }}>Error: {String(error)}</p>}
    </div>
  );
}

export default CustomFieldExtension;
