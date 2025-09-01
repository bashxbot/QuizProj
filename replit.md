# Overview

A minimal static web server built with Python that serves HTML content. The project consists of a simple "Hello World" web page served by a custom Python HTTP server implementation. This is a basic web hosting setup suitable for serving static content during development or for simple web applications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static HTML**: Single `index.html` file with basic structure
- **No JavaScript Framework**: Pure HTML without client-side scripting or CSS
- **Minimal Design**: Bare-bones HTML5 document structure

## Backend Architecture
- **Python HTTP Server**: Custom implementation using Python's built-in `http.server` module
- **Static File Serving**: Extends `SimpleHTTPRequestHandler` to serve files from the current working directory
- **Single-threaded**: Uses `socketserver.TCPServer` for handling requests synchronously
- **Port Configuration**: Hardcoded to run on port 5000 with host binding to all interfaces (0.0.0.0)

## Server Design Decisions
- **Built-in Modules**: Uses only Python standard library modules (`http.server`, `socketserver`, `os`)
- **Development-focused**: Simple server suitable for local development and testing
- **File System Based**: Serves any files present in the current directory without routing logic
- **No Database**: Pure static file serving without data persistence

# External Dependencies

## Runtime Dependencies
- **Python 3**: Requires Python 3.x runtime environment
- **No Package Dependencies**: Uses only Python standard library modules

## Infrastructure
- **No External Services**: Self-contained server without external API integrations
- **No Database**: No data storage or persistence layer
- **Local File System**: Serves content directly from the local directory structure

## Development Environment
- **No Build Tools**: Direct execution without compilation or build processes
- **No Package Manager**: No pip requirements or dependency management needed