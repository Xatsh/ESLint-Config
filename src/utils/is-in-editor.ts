import process from "node:process"

export function isInEditor(): boolean {
	if (process.env.CI)
		return false
	if (isInGitHooksOrLintStaged())
		return false
	return !!(false
		|| process.env.VSCODE_PID
		|| process.env.VSCODE_CWD
		|| process.env.JETBRAINS_IDE
		|| process.env.VIM
		|| process.env.NVIM
	)
}

function isInGitHooksOrLintStaged(): boolean {
	return !!(false
		|| process.env.GIT_PARAMS
		|| process.env.VSCODE_GIT_COMMAND
		|| process.env.npm_lifecycle_script?.startsWith("lint-staged")
	)
}
