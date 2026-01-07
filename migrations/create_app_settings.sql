-- Migração: Criar tabela app_settings para armazenar configurações globais
-- Execute este SQL no Supabase SQL Editor: https://supabase.com/dashboard/project/vhqkdwsqfgfbxfxfqhvk/sql

-- Criar tabela app_settings
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Inserir configuração inicial para banner
INSERT INTO app_settings (setting_key, setting_value)
VALUES ('banner_image_url', '')
ON CONFLICT (setting_key) DO NOTHING;

-- Habilitar RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler
CREATE POLICY "Anyone can read app settings"
    ON app_settings
    FOR SELECT
    USING (true);

-- Política: Apenas administradores podem atualizar
CREATE POLICY "Only administrators can update app settings"
    ON app_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'administrator'
        )
    );
