import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground">ようこそ、{session.user.name}さん</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recruit Scout Hub</CardTitle>
          <CardDescription>エンジニア採用管理システム</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ログインに成功しました。認証機能が正常に動作しています。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
