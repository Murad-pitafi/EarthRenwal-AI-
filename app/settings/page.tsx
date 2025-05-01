"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Settings() {
  const { username, setUsername, language, setLanguage } = useUser()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">{language === "en" ? "User Settings" : "صارف کی ترتیبات"}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Your Profile" : "آپ کی پروفائل"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="username">{language === "en" ? "Username" : "صارف کا نام"}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === "en" ? "Enter your username" : "اپنا صارف نام درج کریں"}
              />
            </div>
            <div>
              <Label htmlFor="language">{language === "en" ? "Language" : "زبان"}</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "ur")}
                className="w-full p-2 border rounded"
              >
                <option value="en">English</option>
                <option value="ur">اردو</option>
              </select>
            </div>
            <Button type="submit">{language === "en" ? "Save Changes" : "تبدیلیاں محفوظ کریں"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
