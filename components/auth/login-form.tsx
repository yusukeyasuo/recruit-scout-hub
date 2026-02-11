"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormMessage } from "@/components/ui/form";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");

    startTransition(async () => {
      const result = await signIn(data);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          disabled={isPending}
          {...register("email")}
        />
        <FormMessage>{errors.email?.message}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
          {...register("password")}
        />
        <FormMessage>{errors.password?.message}</FormMessage>
      </FormField>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3">
          <FormMessage>{error}</FormMessage>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "ログイン中..." : "ログイン"}
      </Button>
    </Form>
  );
}
