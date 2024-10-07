// page.tsx
"use client";

import { useEffect, useState } from "react";

const ExampleFormI9 = () => {
  const [formData, setFormData] = useState(null);

  const generateUniqueKey = (base: string, existingKeys: Set<string>) => {
    // Normaliza el base y limita a caracteres permitidos
    let uniqueKey = base.toLowerCase().replace(/[^a-z0-9_]/g, "");
    
    // Asegura que comienza con un carácter válido
    if (!/^[a-z]/.test(uniqueKey)) {
      uniqueKey = "a" + uniqueKey.slice(0, 27);
    } else {
      uniqueKey = uniqueKey.slice(0, 28);
    }

    // Genera clave única si ya existe
    while (existingKeys.has(uniqueKey)) {
      uniqueKey = uniqueKey.slice(0, 24) + Math.random().toString(36).substring(2, 6);
    }

    existingKeys.add(uniqueKey);
    return uniqueKey;
  };

  useEffect(() => {
    // Fetch data from Form.io
    const fetchData = async () => {
      try {
        const response = await fetch("https://ttfkzplronqfglo.form.io/exampleformi9", {
          method: "GET",
          headers: {
            "x-jwt-token": process.env.NEXT_PUBLIC_FORMIO_JWT || "",
          },  
        });
        const data = await response.json();
        const uniqueKeys = new Set<string>();
        const ratio = 1.75;

        // Transform overlay components to fixed_positions
        let fixedPositions = data.components
          .filter((component: { overlay: any; }) => component.overlay)
          .map((component: { overlay: { top: any; left: any; page: any; width: any }; key: any; }) => {
            let { top, left, page, width } = component.overlay;

            left = Math.round(left / ratio);
            width = Math.round(width / ratio);
            top = Math.round(top / ratio);
            if (left  > 460) {
              console.log("Component width exceeds page width", component.key, left, width, component.overlay);
              left = 461;
            }
            return {
              place_key: generateUniqueKey(component.key, uniqueKeys),
              page: page,
              top: top,
              left: left,
            };
          });

        // Create places array
        let places = fixedPositions.map((position: { place_key: any; }) => ({
          key: position.place_key,
          type: "text_input",
          recipient_key: "employee",
        }));

        // fixedPositions = fixedPositions.slice(0, 10);
        // places = places.slice(0, 10);
        // Envelope payload
        const envelopePayload = {
          title: `I9 form Example ${ratio}`,
          language: "en",
          documents: [
            {
              url: "https://api.signatureapi.com/v1/files/fil_7FfhQMetWEW2bfylPTvLZI",
              fixed_positions: fixedPositions.slice(),
              places: places.slice(),
            },
          ],
          recipients: [
            {
              type: "signer",
              key: "employee",
              name: "Employee 1",
              email: "santiago@signatureapi.dev",
            },
          ],
        };
        console.log("Envelope payload:", envelopePayload);

        // Post envelope data to local API
        const postResponse = await fetch("/api/signatureapi/envelopes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
                      
          },
          body: JSON.stringify(envelopePayload),
        });
        console.log("Post response:", postResponse);

        if (!postResponse.ok) {
          throw new Error("Failed to post envelope data");
        }

        setFormData(await postResponse.json());
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>I9 Form Example</h1>
      {formData ? (
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ExampleFormI9;
