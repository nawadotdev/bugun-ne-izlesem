"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { User, Camera, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, token, login } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // @ts-ignore
    window.cloudinary?.setCloudName("dmc5mnmdv");

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser && !token) {
      login(JSON.parse(storedUser), storedToken);
    }
  }, [token, login, user]);

  useEffect(() => {
    if (!token && !localStorage.getItem("token")) {
      window.location.href = "/auth/login";
    }
  }, [token]);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Güncelleme sırasında bir hata oluştu");
      }

      login(data, token);
      setSuccess("Profil başarıyla güncellendi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (result: any) => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return;
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ image: result.info.secure_url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Güncelleme sırasında bir hata oluştu");
      }

      login(data, currentToken);
      setImage(result.info.secure_url);
      setSuccess("Profil resmi başarıyla güncellendi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Profil Ayarları</h1>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg mb-6 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-lg mb-6 border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Profil Resmi</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-4 border-slate-200 dark:border-slate-600">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Profil resminizi güncelleyin. Önerilen boyut: 400x400 piksel.
                </p>
                <CldUploadButton
                  uploadPreset="bugun_ne_izlesem"
                  onSuccess={(result: any) => {
                    if (result.info && result.info.secure_url) {
                      handleImageUpload(result);
                    } else {
                      setError("Resim yüklenirken bir hata oluştu");
                    }
                  }}
                  onError={(error: any) => {
                    setError("Resim yüklenirken bir hata oluştu");
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yükleniyor...
                    </span>
                  ) : (
                    "Resim Yükle"
                  )}
                </CldUploadButton>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">İsim</h2>
            <form onSubmit={handleNameUpdate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  İsminiz
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="İsminiz"
                  className="max-w-md"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-100 dark:text-slate-900"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Güncelleniyor...
                  </span>
                ) : (
                  "Güncelle"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 