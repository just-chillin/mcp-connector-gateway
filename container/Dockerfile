# Upstream image already bundles Chromium, Xvfb and the server.
FROM stickerdaniel/linkedin-mcp-server:4.30.0

USER root
COPY --chmod=755 restore-session.sh /usr/local/bin/restore-session
USER pwuser

EXPOSE 8000
# Restore the LinkedIn session from LINKEDIN_SESSION_B64, then hand off to the
# upstream entrypoint in HTTP mode, bound to all interfaces so the Worker can reach it.
ENTRYPOINT ["tini", "-e", "143", "--", "restore-session", \
  "linkedin-mcp-entrypoint", "python", "-m", "linkedin_mcp_server", \
  "--transport", "streamable-http", "--host", "0.0.0.0", "--port", "8000", "--path", "/mcp"]
CMD []
