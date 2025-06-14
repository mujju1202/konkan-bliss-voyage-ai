export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          author: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          created_at: string
          id: string
          question: string
          response: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          question: string
          response: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          question?: string
          response?: string
          user_id?: string | null
        }
        Relationships: []
      }
      custom_packages: {
        Row: {
          activities: string[]
          created_at: string
          days: number
          destinations: string[]
          estimated_price: number | null
          id: string
          user_id: string
        }
        Insert: {
          activities: string[]
          created_at?: string
          days: number
          destinations: string[]
          estimated_price?: number | null
          id?: string
          user_id: string
        }
        Update: {
          activities?: string[]
          created_at?: string
          days?: number
          destinations?: string[]
          estimated_price?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          budget: string
          created_at: string
          duration: string
          generated_plan: string
          group_type: string
          id: string
          interests: string[]
          title: string
          user_id: string
        }
        Insert: {
          budget: string
          created_at?: string
          duration: string
          generated_plan: string
          group_type: string
          id?: string
          interests: string[]
          title: string
          user_id: string
        }
        Update: {
          budget?: string
          created_at?: string
          duration?: string
          generated_plan?: string
          group_type?: string
          id?: string
          interests?: string[]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          description: string
          duration: string
          highlights: string[]
          id: string
          image_url: string | null
          places_included: string[]
          price: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          highlights: string[]
          id?: string
          image_url?: string | null
          places_included: string[]
          price: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          places_included?: string[]
          price?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tour_packages: {
        Row: {
          activities: string[]
          attractions: string[] | null
          coordinates: Json | null
          created_at: string
          created_by: string | null
          description: string
          destinations: string[]
          duration: string
          id: string
          images: string[] | null
          is_featured: boolean | null
          itinerary: Json | null
          max_participants: number | null
          price: number
          season: Database["public"]["Enums"]["package_season"]
          theme: Database["public"]["Enums"]["package_theme"]
          title: string
          updated_at: string
        }
        Insert: {
          activities: string[]
          attractions?: string[] | null
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          description: string
          destinations: string[]
          duration: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          itinerary?: Json | null
          max_participants?: number | null
          price: number
          season?: Database["public"]["Enums"]["package_season"]
          theme: Database["public"]["Enums"]["package_theme"]
          title: string
          updated_at?: string
        }
        Update: {
          activities?: string[]
          attractions?: string[] | null
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string
          destinations?: string[]
          duration?: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          itinerary?: Json | null
          max_participants?: number | null
          price?: number
          season?: Database["public"]["Enums"]["package_season"]
          theme?: Database["public"]["Enums"]["package_theme"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      package_season: "summer" | "monsoon" | "winter" | "year_round"
      package_theme:
        | "adventure"
        | "nature"
        | "heritage"
        | "beach"
        | "spiritual"
        | "family"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      package_season: ["summer", "monsoon", "winter", "year_round"],
      package_theme: [
        "adventure",
        "nature",
        "heritage",
        "beach",
        "spiritual",
        "family",
      ],
    },
  },
} as const
