package main

import (
	"testing"
)

func TestGetEnv_WithValue(t *testing.T) {
	t.Setenv("TEST_VAR", "test_value")
	result := getEnv("TEST_VAR", "default")

	if result != "test_value" {
		t.Errorf("Expected 'test_value', got '%s'", result)
	}
}

func TestGetEnv_WithoutValue(t *testing.T) {
	result := getEnv("NON_EXISTENT_VAR", "default_value")

	if result != "default_value" {
		t.Errorf("Expected 'default_value', got '%s'", result)
	}
}

func TestGetEnv_EmptyDefault(t *testing.T) {
	result := getEnv("NON_EXISTENT_VAR", "")

	if result != "" {
		t.Errorf("Expected empty string, got '%s'", result)
	}
}
