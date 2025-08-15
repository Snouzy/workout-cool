#!/bin/bash

# Docker Build Testing Script
# Works for both local testing and CI environments
# Usage: ./test-docker-build.sh [--ci]

set -e

# Check if running in CI mode
CI_MODE=false
if [[ "$1" == "--ci" ]] || [[ "$CI" == "true" ]]; then
    CI_MODE=true
fi

if [[ "$CI_MODE" == "true" ]]; then
    echo "🔧 Testing Docker Build (CI Mode)..."
else
    echo "🔧 Testing Docker Build (Local Mode)..."
fi

# Colors for output (disabled in CI)
if [[ "$CI_MODE" == "true" ]]; then
    RED=''
    GREEN=''
    YELLOW=''
    NC=''
else
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
fi

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    docker rmi workout-cool-test 2>/dev/null || true
}

# Set up cleanup trap
trap cleanup EXIT

echo -e "${YELLOW}📦 Building Docker image...${NC}"
if docker build -t workout-cool-test .; then
    echo -e "${GREEN}✅ Docker build successful!${NC}"
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

# Skip detailed inspection in CI mode for speed
if [[ "$CI_MODE" == "false" ]]; then
    echo -e "${YELLOW}🔍 Inspecting built image...${NC}"
    docker images workout-cool-test

    echo -e "${YELLOW}🏃 Testing container startup (dry run)...${NC}"
    if docker run --rm -e DATABASE_URL="postgresql://test:test@localhost:5432/test" workout-cool-test echo "Container can start"; then
        echo -e "${GREEN}✅ Container startup test passed!${NC}"
    else
        echo -e "${RED}❌ Container startup test failed!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}🎉 Docker build test passed!${NC}"

if [[ "$CI_MODE" == "false" ]]; then
    echo -e "${YELLOW}💡 Next steps:${NC}"
    echo "  • Test the GitHub Actions workflow with a manual trigger"
    echo "  • Deploy to your registry"
    echo "  • Test with docker-compose using the built image"
fi